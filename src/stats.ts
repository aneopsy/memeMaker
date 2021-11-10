import { web3 } from "@project-serum/anchor";
import kleur from "kleur";
import { getConnection } from "./helpers/connection";
import { chunks, loadFile, toPublicKey } from "./helpers/various";
import {
  downloadAttrS3,
  downloadS3,
  getAttributeTable,
  listS3,
  uploadS3,
} from "./helpers/aws";
import { AttributeItemItem } from "./types";
import pixsols from "./helpers/pixsols";
import axios from "axios";
import sha256 from "crypto-js/sha256";

const THREADS = 50;

(async () => {
  const connection = getConnection("mainnet-beta");
  const attributeTable = await getAttributeTable();

  const s3List = (await listS3("pixsols-metadatas"))
    .filter((x) => (x.Key as string).startsWith("pixsols/"))
    .slice(0, 10)
    .map((x) => x.Key);
  const metadatas = [];
  let done = 0;
  await Promise.all(
    chunks(s3List, Math.ceil(s3List.length / THREADS)).map(
      async (attributeItems: number[]) => {
        for (let attributeItemIndex of attributeItems) {
          metadatas.push(
            (
              await axios.get(
                `https://pixsols-metadatas.s3.amazonaws.com/${attributeItemIndex}`
              )
            ).data
          );
          console.log(`+ ${done++}`);
        }
      }
    )
  );
  let total = metadatas.length;

  const stats = {};
  metadatas.map((metadata: any) => {
    metadata.attributes.map((attr: any) => {
      if (attr["trait_type"] === "Rank") return;
      if (!stats.hasOwnProperty(attr["trait_type"]))
        stats[attr["trait_type"]] = {};
      if (!stats[attr["trait_type"]][attr.value])
        stats[attr["trait_type"]][attr.value] = 0;
      stats[attr["trait_type"]][attr.value] += (1 / total) * 100;
    });
  });
  console.log(JSON.stringify(stats, null, 2));

  for (let attributeIndex in attributeTable) {
    let done = 0;

    await Promise.all(
      chunks(
        Array.from(Array(attributeTable[attributeIndex].items.length).keys()),
        Math.ceil(attributeTable[attributeIndex].items.length / THREADS)
      ).map(async (attributeItems: number[]) => {
        for (let attributeItemIndex of attributeItems) {
          attributeTable[attributeIndex].items[attributeItemIndex].stats = {
            sft: attributeTable[attributeIndex].items[attributeItemIndex].mint
              ? (
                  await connection.getTokenSupply(
                    toPublicKey(
                      attributeTable[attributeIndex].items[attributeItemIndex]
                        .mint
                    )
                  )
                ).value.uiAmount
              : null,
            apply:
              stats[attributeTable[attributeIndex].name]?.[
                attributeTable[attributeIndex].items[attributeItemIndex].name
              ] || 0,
          };
          console.log(
            `+ done ${done++} - ${
              attributeTable[attributeIndex].items[attributeItemIndex].mint
            }`
          );
        }
      })
    );
  }

  const howrareis: any = metadatas.reduce((acc: any[], metadata: any) => {
    const score = metadata.attributes.reduce((acc: number, attr: any) => {
      if (attr["trait_type"] === "Rank") return acc;
      acc += 1 / stats[attr["trait_type"]][attr.value];
      return acc;
    }, 0);
    acc.push({ id: metadata.id, score });
    return acc;
  }, []);

  const ranks = howrareis
    .sort((a: any, b: any) => b.score - a.score)
    .map((a: any, rank: number) => ({
      ...a,
      rank: `${rank + 1}/${total}`,
    }));

  console.log(JSON.stringify(ranks, null, 2));

  for (let rank of ranks) {
    const pixsolKey = sha256(`PIXSOLS${String(rank.id)}`);
    const metadata = metadatas.find((x) => x.id === rank.id);
    const index = (metadata.attributes as any[]).findIndex(
      (attr) => attr["trait_type"] === "Rank"
    );
    if (index > -1) {
      metadata.attributes.splice(index, 1);
    }
    metadata.attributes.push({ trait_type: "Rank", value: rank.rank });
    console.log(metadata);
    // await uploadS3(
    //   "pixsols-metadatas",
    //   `pixsols/${pixsolKey}.json`,
    //   JSON.stringify(metadata, null, 2)
    // );
  }

  // Object.keys(metadatas).map((key) => {
  //   metadatas[key].metadata.attributes[
  //     metadatas[key].metadata.attributes.length - 1
  //   ].value = ranks.find((x) => x.name === metadatas[key].metadata.name).rank;
  //   metadatas[key].metadata.description =
  //     "The Pixsols are a collection of 4,877 fully customisable NFTs with an ever expanding attribute library for you to choose from. Make it your own.";
  // });
  // console.log(JSON.stringify(metadatas, null, 2));
  // saveFile(file, metadatas);

  // console.log(JSON.stringify(ranks.reverse(), null, 2));

  // await Promise.all(
  //   chunks(
  //     Array.from(Array(pixsols.length).keys()),
  //     Math.ceil(attributeTable[attributeIndex].items.length / THREADS)
  //   ).map(async (attributeItems: number[]) => {
  //     for (let attributeItemIndex of attributeItems) {
  //       attributeTable[attributeIndex].items[attributeItemIndex].stats = {
  //         sft: attributeTable[attributeIndex].items[attributeItemIndex].mint
  //           ? (
  //               await connection.getTokenSupply(
  //                 toPublicKey(
  //                   attributeTable[attributeIndex].items[attributeItemIndex]
  //                     .mint
  //                 )
  //               )
  //             ).value.uiAmount
  //           : null,
  //         apply: null,
  //       };
  //       console.log(
  //         `+ done ${done++} - ${
  //           attributeTable[attributeIndex].items[attributeItemIndex].mint
  //         }`
  //       );
  //     }
  //   })
  // );

  // console.log(JSON.stringify(attributeTable, null, 2));
  // await uploadS3(
  //   "pixsols-config",
  //   "attributes.json",
  //   JSON.stringify(attributeTable, null, 2)
  // );
})();
