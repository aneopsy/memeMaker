import { Canvas, createCanvas, Image } from "canvas";
import mergeImages from "merge-images";
import express from "express";
import path from "path";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import axios from "axios";
import * as anchor from "@project-serum/anchor";

import { getConnection } from "./helpers/connection";
import { getMetadata, getTokenWallet } from "./helpers/accounts";
import { toPublicKey } from "./helpers/various";
import { decodeMetadata, updateMetadata } from "./helpers/metadata";
import {
  generateGif,
  generateSample,
  getAttrFromMint,
  update2Arweave,
} from "./helpers/gif";
import { replaceAttr, sequence, unsequence } from "./helpers/dna";
import {
  awaitParsedConfirmedTransactions,
  awaitTransactionSignatureConfirmation,
  sendTransactionWithRetryWithKeypair,
} from "./helpers/transactions";
import { Attribute } from "./types";
import { attributeTable } from "./helpers/tables";
import pixsols from "./helpers/pixsols";
import { DEFAULT_TIMEOUT } from "./helpers/constants";
import log from "loglevel";

log.setLevel("info");

require("dotenv").config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 8081;

app.get("/gif/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const gif = await generateGif(unsequence(dna));
  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Content-Length": gif.length,
  });
  res.end(gif);
});

app.get("/sample/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const png = Buffer.from(
    (await generateSample(unsequence(dna))).replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    ),
    "base64"
  );

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": png.length,
  });
  res.end(png);
});

app.post("/gif", async (req, res) => {
  const { body } = req;
  const sequenced = sequence(body);

  const gif = await generateGif(unsequence(sequenced));
  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Content-Length": gif.length,
  });
  res.end(gif);
});

app.get("/decode/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const unsequenced = unsequence(dna);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(unsequenced));
});

app.get("/attributes", async (req, res) => {
  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(attributeTable));
});

app.get("/pixsols", async (req, res) => {
  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(pixsols));
});

app.post("/encode", async (req, res) => {
  const { body } = req;
  const sequenced = sequence(body);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(sequenced));
});

app.post("/merge", async (req, res) => {
  const timeValidation = 1000 * 60;
  const authority = "Piiiij2D83a4TUosdUuA8hJZCRS8sfYvNLAPEw8P7tm";
  const connection = getConnection("mainnet-beta");
  const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.PRIVATE_KEY))
  );
  const headers = { "Content-Type": "application/json" };
  const { body } = req;
  const { signature, data, signer } = body;

  const verify = nacl.sign.detached.verify(
    new TextEncoder().encode(JSON.stringify(data)),
    bs58.decode(signature),
    bs58.decode(signer)
  );
  if (!verify) {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ error: "Invalid signature" }));
    return;
  }
  if (data.timestamp + timeValidation < Date.now()) {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ error: "Request is outdated" }));
    return;
  }
  const pixsolMint = data.params.address;
  console.log("pixsolAddr", pixsolMint);

  //
  // VERIFICATION ON CHAIN FOR ATTR
  //
  console.log(`###############################################`);
  const fetched: any = await awaitParsedConfirmedTransactions(
    data.params.tx,
    DEFAULT_TIMEOUT,
    connection
  );
  console.log("fetched", fetched);
  if (fetched === null || !fetched.meta.status.hasOwnProperty("Ok")) {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ error: "Invalid Tx" }));
    return;
  }
  let memo;
  const newAttrInfo = await fetched.transaction.message.instructions.reduce(
    async (acc: any[], element: any) => {
      console.log(JSON.stringify(element, null, 2));
      if (element.program === "spl-memo") memo = element.parsed;
      if (
        element?.parsed?.type === "transferChecked" &&
        element?.parsed?.info?.authority === authority &&
        element.parsed.info.tokenAmount.amount === "1" //&&
        // ((await getTokenWallet(
        //   toPublicKey(signer),
        //   toPublicKey(element.parsed.info.mint)
        // )) === element.parsed.info.source &&
        //   (await getTokenWallet(
        //     toPublicKey(authority),
        //     toPublicKey(element.parsed.info.mint)
        //   ))) === element.parsed.info.destination
      )
        acc.push(element.parsed.info);
      return acc;
    },
    []
  );

  if (parseInt(memo) !== data.timestamp) {
    res.writeHead(200, headers);
    res.end(
      JSON.stringify({
        error: "Timestamp in Tx and in signature is not the same",
      })
    );
    return;
  }
  if (!newAttrInfo.length) {
    res.writeHead(200, headers);
    res.end(
      JSON.stringify({
        error: "No attributes found in the Tx",
      })
    );
    return;
  }

  const newAttrs: Attribute[] = newAttrInfo.map((attrInfo: any) =>
    getAttrFromMint(attrInfo.mint)
  );
  console.log(newAttrs);
  //
  // NEW METADATA
  //
  const metadataKey = await getMetadata(toPublicKey(pixsolMint));
  const metadataAccount = await connection.getAccountInfo(metadataKey);

  const pixsolData = decodeMetadata(metadataAccount.data).data;

  const metadata: any = (await axios.get(pixsolData.uri)).data;
  metadata.attributes = newAttrs.reduce(
    (acc: Attribute[], newAttr: Attribute): Attribute[] => {
      acc = replaceAttr(acc, newAttr);
      return acc;
    },
    metadata.attributes
  );
  const gif = await generateGif(metadata.attributes);
  let newUri = null;
  do {
    try {
      newUri = await update2Arweave(metadata, gif);
    } catch {}
  } while (!newUri);

  pixsolData.uri = newUri;
  //
  // SEND TX
  //
  const instructions: any[] = [];
  await updateMetadata(
    pixsolData,
    undefined,
    undefined,
    pixsolMint,
    walletKeyPair.publicKey.toBase58(),
    instructions,
    metadataKey.toBase58()
  );
  const tx = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeyPair,
    instructions,
    [],
    "confirmed"
  );

  console.log(`+ (${pixsolData.name}) ${pixsolMint} updated | tx: ${tx.txid}`);
  console.log(`###############################################`);

  res.writeHead(200, headers);
  res.end(JSON.stringify({ error: null, tx: tx.txid, mint: pixsolMint }));
});

//
// OTHERS
//

app.get("/", (req, res) => res.send("You have reached the Pixsols Generator"));

app.listen(port, () => {
  console.log(`Pixsols Generator listening at on port ${port}`);
});
