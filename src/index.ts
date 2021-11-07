import { Canvas, createCanvas, Image } from "canvas";
import mergeImages from "merge-images";
import express from "express";
import cors from "cors";
import path from "path";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import axios from "axios";
import * as anchor from "@project-serum/anchor";
import sha256 from "crypto-js/sha256";

import { getConnection } from "./helpers/connection";
import { getAtaForMint, getMetadata, getTokenWallet } from "./helpers/accounts";
import { toPublicKey } from "./helpers/various";
import { decodeMetadata, updateMetadata } from "./helpers/metadata";
import {
  checkDNA,
  generateCrop,
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
import pixsols from "./helpers/pixsols";
import { DEFAULT_TIMEOUT } from "./helpers/constants";
import log from "loglevel";
import { downloadS3, getAttributeTable, uploadS3 } from "./helpers/aws";

log.setLevel("info");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8081;

app.get("/gif/:dna", async (req, res, next) => {
  const { params } = req;
  const dna = params?.dna;
  if (!checkDNA(dna)) next("Wrong DNA");
  const gif = await generateGif(dna);
  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Content-Length": gif.length,
  });
  res.end(gif);
});

app.get("/sample/:dna", async (req, res, next) => {
  const { params } = req;
  const dna = params?.dna;
  if (!checkDNA(dna)) next("Wrong DNA");
  const png = Buffer.from(
    (await generateSample(dna))
      .toString()
      .replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
    "base64"
  );

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": png.length,
  });
  res.end(png);
});

app.get("/sample/crop/:dna", async (req, res, next) => {
  const { params } = req;
  const dna = params?.dna;
  if (!checkDNA(dna)) next("Wrong DNA");
  const png = Buffer.from(
    (await generateCrop(dna))
      .toString()
      .replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
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
  const sequenced = await sequence(body);

  const gif = await generateGif(sequenced);
  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Content-Length": gif.length,
  });
  res.end(gif);
});

app.get("/decode/:dna", async (req, res) => {
  const { params } = req;
  const dna = params?.dna;

  const unsequenced = await unsequence(dna);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(unsequenced));
});

app.get("/attributes", async (req, res) => {
  const headers = { "Content-Type": "application/json" };
  const attributeTable = await getAttributeTable();
  res.writeHead(200, headers);
  res.end(JSON.stringify(attributeTable));
});

app.get("/pixsols", async (req, res) => {
  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(pixsols));
});

app.get("/holders", async (req, res) => {
  const headers = { "Content-Type": "application/json" };
  const holders = await downloadS3("pixsols-config", "leaderboard.json");
  res.writeHead(200, headers);
  res.end(holders);
});

app.post("/encode", async (req, res) => {
  const { body } = req;
  const sequenced = await sequence(body);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(sequenced));
});

app.post("/merge", async (req, res, next) => {
  const mergePrice = 12000000;
  const authority = "Piiiij2D83a4TUosdUuA8hJZCRS8sfYvNLAPEw8P7tm";
  const connection = getConnection("mainnet-beta");
  const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.PRIVATE_KEY))
  );
  const headers = { "Content-Type": "application/json" };
  const { body } = req;
  const { signedTx } = body;

  const tx = await connection.sendRawTransaction(signedTx, {
    skipPreflight: true,
  });

  //
  // VERIFICATION ON CHAIN FOR ATTR
  //
  const fetched: any = await awaitParsedConfirmedTransactions(
    tx,
    DEFAULT_TIMEOUT,
    connection,
    "confirmed"
  );
  // console.log("fetched", fetched);
  if (fetched === null || !fetched.meta.status.hasOwnProperty("Ok")) {
    return res.status(400).send({
      message: "Invalid Tx",
    });
  }
  let pixsolMint: string;
  let hasPaid: boolean;
  const newAttrInfo = await fetched.transaction.message.instructions.reduce(
    (acc: string[], element: any) => {
      if (element.program === "spl-memo") pixsolMint = element.parsed;
      if (
        element?.parsed?.type === "transfer" &&
        element?.parsed?.info?.destination === authority &&
        element.parsed.info.lamports === mergePrice
      )
        hasPaid = true;
      if (
        element?.parsed?.type === "burn" &&
        element.parsed.info.amount === "1"
      )
        acc.push(element.parsed.info.mint);
      return acc;
    },
    []
  );

  console.log("hasPaid", hasPaid);
  console.log("pixsolMint", pixsolMint);
  console.log(newAttrInfo);
  if (!pixsolMint) {
    return res.status(400).send({
      message: "No pixsolMint found in the Tx",
    });
  }
  if (!newAttrInfo.length) {
    return res.status(400).send({
      message: "No attributes found in the Tx",
    });
  }

  const newAttrs: Attribute[] = await Promise.all(
    newAttrInfo.map(async (mint: any) => getAttrFromMint(mint))
  );

  //
  // NEW METADATA
  //
  const metadataKey = await getMetadata(toPublicKey(pixsolMint));
  const metadataAccount = await connection.getAccountInfo(metadataKey);
  const owners = await connection.getTokenLargestAccounts(
    toPublicKey(pixsolMint)
  );
  const ownerAccount = owners.value[0].address;
  const accountInfo = (await connection.getParsedAccountInfo(ownerAccount))
    .value;

  if (
    accountInfo &&
    "parsed" in accountInfo.data &&
    accountInfo.data.parsed.info.owner !==
      fetched.transaction.message.accountKeys[0].pubkey.toBase58()
  ) {
    return res.status(400).send({
      message: "You are not the Pixsol owner!",
    });
  }
  const pixsolData = decodeMetadata(metadataAccount.data).data;

  const metadata: any = (await axios.get(pixsolData.uri)).data;
  metadata.attributes = newAttrs
    .reduce((acc: Attribute[], newAttr: Attribute): Attribute[] => {
      acc = replaceAttr(acc, newAttr);
      return acc;
    }, metadata.attributes)
    .filter((attr) => attr.trait_type !== "Rank");
  const gifLink = `https://pixsols-test.herokuapp.com/gif/${await sequence(
    metadata.attributes
  )}`;
  metadata.image = gifLink;
  metadata.properties.files[0].uri = gifLink;

  const pixsolKey = sha256(`PIXSOLS${String(metadata.id)}`);
  await uploadS3(
    "pixsols-metadatas",
    `pixsols/${pixsolKey}.json`,
    JSON.stringify(metadata, null, 2)
  );
  pixsolData.uri = `https://pixsols-metadatas.s3.amazonaws.com/pixsols/${pixsolKey}.json`;

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
  const txUpdateMetadata = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeyPair,
    instructions,
    [],
    "confirmed"
  );

  console.log(
    `+ (${pixsolData.name}) ${pixsolMint} updated | tx: ${txUpdateMetadata.txid}`
  );
  console.log(`###############################################`);

  res.writeHead(200, headers);
  res.end(
    JSON.stringify({
      error: null,
      txUpdateMetadata: txUpdateMetadata.txid,
      mint: pixsolMint,
      tx,
    })
  );
});

app.post("/rename", async (req, res, next) => {
  const mergePrice = 12000000;
  const authority = "Piiiij2D83a4TUosdUuA8hJZCRS8sfYvNLAPEw8P7tm";
  const connection = getConnection("mainnet-beta");
  const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.PRIVATE_KEY))
  );
  const headers = { "Content-Type": "application/json" };
  const { body } = req;
  const { signedTx, signer, signature, data } = body;

  const verify = nacl.sign.detached.verify(
    new TextEncoder().encode(JSON.stringify(data)),
    bs58.decode(signature),
    bs58.decode(signer)
  );
  const pixsolMint = body.data.params[0];
  console.log("verify", verify);
  console.log("pixsolAddr", pixsolMint);

  const tx = await connection.sendRawTransaction(signedTx, {
    skipPreflight: true,
  });

  //
  // VERIFICATION ON CHAIN FOR ATTR
  //
  const fetched: any = await awaitParsedConfirmedTransactions(
    tx,
    DEFAULT_TIMEOUT,
    connection,
    "confirmed"
  );
  if (fetched === null || !fetched.meta.status.hasOwnProperty("Ok")) {
    return res.status(400).send({
      message: "Invalid Tx",
    });
  }
  let hasPaid: boolean;
  await fetched.transaction.message.instructions.map((element: any) => {
    if (
      element?.parsed?.type === "transfer" &&
      element?.parsed?.info?.destination === authority &&
      element.parsed.info.lamports === mergePrice
    )
      hasPaid = true;
  });

  console.log("hasPaid", hasPaid);
  console.log("pixsolMint", pixsolMint);
  if (!pixsolMint) {
    return res.status(400).send({
      message: "No pixsolMint found in the Tx",
    });
  }

  //
  // NEW METADATA
  //
  const metadataKey = await getMetadata(toPublicKey(pixsolMint));
  const metadataAccount = await connection.getAccountInfo(metadataKey);
  const owners = await connection.getTokenLargestAccounts(
    toPublicKey(pixsolMint)
  );
  const ownerAccount = owners.value[0].address;
  const accountInfo = (await connection.getParsedAccountInfo(ownerAccount))
    .value;

  if (
    accountInfo &&
    "parsed" in accountInfo.data &&
    accountInfo.data.parsed.info.owner !==
      fetched.transaction.message.accountKeys[0].pubkey.toBase58()
  ) {
    return res.status(400).send({
      message: "You are not the Pixsol owner!",
    });
  }
  const pixsolData = decodeMetadata(metadataAccount.data).data;

  const metadata: any = (await axios.get(pixsolData.uri)).data;
  metadata.name = `(#${metadata.id}) ${data.params[1]}`;
  pixsolData.name = metadata.name;

  const pixsolKey = sha256(`PIXSOLS${String(metadata.id)}`);
  await uploadS3(
    "pixsols-metadatas",
    `pixsols/${pixsolKey}.json`,
    JSON.stringify(metadata, null, 2)
  );
  pixsolData.uri = `https://pixsols-metadatas.s3.amazonaws.com/pixsols/${pixsolKey}.json`;

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
  const txUpdateMetadata = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeyPair,
    instructions,
    [],
    "confirmed"
  );

  console.log(
    `+ (${pixsolData.name}) ${pixsolMint} updated | tx: ${txUpdateMetadata.txid}`
  );
  console.log(`###############################################`);

  res.writeHead(200, headers);
  res.end(
    JSON.stringify({
      error: null,
      txUpdateMetadata: txUpdateMetadata.txid,
      mint: pixsolMint,
      tx,
    })
  );
});

//
// OTHERS
//

app.get("/", (req, res) => res.send("You have reached the Pixsols Generator"));

app.listen(port, () => {
  console.log(`Pixsols Generator listening at on port ${port}`);
});
