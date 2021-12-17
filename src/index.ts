import express from "express";
import cors from "cors";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import axios from "axios";
import * as anchor from "@project-serum/anchor";
import sha256 from "crypto-js/sha256";
import mysql from "mysql2/promise";

import { getConnection } from "./helpers/connection";
import { getMetadata } from "./helpers/accounts";
import { toPublicKey } from "./helpers/various";
import { decodeMetadata, updateMetadata } from "./helpers/metadata";
import {
  checkDNA,
  generateCrop,
  generateGif,
  generateSample,
  getAttrFromId,
  getAttrFromMint,
} from "./helpers/gif";
import { replaceAttr, sequence, unsequence } from "./helpers/dna";
import {
  awaitParsedConfirmedTransactions,
  sendTransactionWithRetryWithKeypair,
} from "./helpers/transactions";
import { Attribute } from "./types";
import pixsols from "./helpers/pixsols";
import { DEFAULT_TIMEOUT } from "./helpers/constants";
import log from "loglevel";
import { downloadS3, getMetadatas, uploadS3 } from "./helpers/aws";
import { addUniq, getAttributeTable, isUniq, removeUniq } from "./helpers/db";
import {
  AWS_URI,
  ENV,
  FEES,
  HOST,
  SALTKEY,
  UPDATE_AUTHORITY,
} from "./config/general";

log.setLevel("info");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8081;

app.get("/sample/:dna", async (req, res, next) => {
  const { params } = req;
  const dna = params?.dna;
  if (!checkDNA(dna)) next(`Wrong DNA : ${dna}`);
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

app.post("/encode", async (req, res) => {
  const { body } = req;
  const sequenced = await sequence(body);

  const headers = { "Content-Type": "application/json" };
  res.writeHead(200, headers);
  res.end(JSON.stringify(sequenced));
});

app.post("/update", async (req, res, next) => {
  log.info(`* Update method trigger`);
  const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.PRIVATE_KEY))
  );

  const connection = getConnection(ENV);
  const headers = { "Content-Type": "application/json" };
  const { body } = req;
  const { signedTx } = body;

  //
  // VERIFICATION ON CHAIN FOR ATTR
  //
  const tx = await connection.sendRawTransaction(signedTx, {
    skipPreflight: true,
  });
  log.info(`+ Tx: ${tx}`);
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

  let mint: string;
  let dna: string;
  let hasPaid: boolean = false;
  await fetched.transaction.message.instructions.forEach((element: any) => {
    if (element.program === "spl-memo") [mint, dna] = element.parsed.split(":");
    if (
      element?.parsed?.type === "transferChecked" &&
      element?.parsed?.info?.destination ===
        "EnRt9tEc4oEA53wQFGBad5ihBayzxrphhAb7VqRieGFJ" && //UPDATE_AUTHORITY
      element?.parsed?.info?.tokenAmount?.amount === FEES
    )
      hasPaid = true;
  }, []);

  if (!mint) {
    return res.status(400).send({
      message: "No Nft found in the Tx",
    });
  }
  if (!dna) {
    return res.status(400).send({
      message: "No DNA found in the Tx",
    });
  }
  if (!(await isUniq(dna))) {
    return res.status(400).send({
      message: "DNA not unique",
    });
  }

  log.info(`+ mint: ${mint}`);
  log.info(`+ dna: ${dna}`);
  log.info(`+ hasPaid: ${hasPaid}`);

  const newAttrs: Attribute[] = await unsequence(dna);

  log.info(`+ Attributes: ${JSON.stringify(newAttrs)}`);
  //
  // NEW METADATA
  //
  const metadataKey = await getMetadata(toPublicKey(mint));
  const metadataAccount = await connection.getAccountInfo(metadataKey);
  const owners = await connection.getTokenLargestAccounts(toPublicKey(mint));
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
      message: "You are not the NFT owner!",
    });
  }
  const nftData = decodeMetadata(metadataAccount.data).data;
  const metadata: any = (await axios.get(nftData.uri)).data;
  const oldDNA = await sequence(metadata.attributes);

  metadata.attributes = newAttrs.reduce(
    (acc: Attribute[], newAttr: Attribute): Attribute[] => {
      acc = replaceAttr(acc, newAttr);
      return acc;
    },
    metadata.attributes
  );
  const imageLink = `${AWS_URI}/images/${dna}.png`;
  metadata.image = imageLink;
  metadata.properties.files[0].uri = imageLink;

  log.info(`+ imageLink: ${imageLink}`);

  const NFTKey = sha256(`${SALTKEY}${String(metadata.id)}`);
  nftData.uri = `${AWS_URI}/metadatas/${NFTKey}.json`;

  //
  // SEND TX
  //
  const instructions: any[] = [];
  await updateMetadata(
    nftData,
    undefined,
    undefined,
    mint,
    walletKeyPair.publicKey.toBase58(),
    instructions,
    metadataKey.toBase58()
  );

  //UPLOAD DURING WAITING PERIOD
  console.log("uploadS3");
  await uploadS3(`metadatas/${NFTKey}.json`, JSON.stringify(metadata, null, 2));
  console.log("generate");
  await generateSample(dna);
  await removeUniq(oldDNA);
  await addUniq(mint, dna);

  const txUpdateMetadata = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeyPair,
    instructions,
    [],
    "processed"
  );

  console.log(
    `+ (${nftData.name}) ${mint} updated | tx: ${txUpdateMetadata.txid}`
  );

  res.writeHead(200, headers);
  res.end(
    JSON.stringify({
      error: null,
      txUpdateMetadata: txUpdateMetadata.txid,
      mint,
      tx,
    })
  );
});

//
// OTHERS
//

app.get("/", (req, res) => res.send("You have reached the AneoPsy Server"));

app.listen(port, () => {
  console.log(`AneoPsy server listening at on port ${port}`);
});
