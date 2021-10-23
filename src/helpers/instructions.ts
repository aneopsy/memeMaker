import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as fs from "fs";
import FormData from "form-data";
import kleur from "kleur";
import {
  CANDY_MACHINE_PROGRAM_ID,
  CONFIG_ARRAY_START,
  CONFIG_LINE_SIZE,
  EXTENSION_GIF,
  EXTENSION_PNG,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "./constants";
import * as anchor from "@project-serum/anchor";
import { chunks, loadFile, readDir, upload } from "./various";
import axios from "axios";
import { LinkStatus } from "../types";
import { programIds } from "./programIds";

export function createAssociatedTokenAccountInstruction(
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
}

export function createMetadataInstruction(
  metadataAccount: PublicKey,
  mint: PublicKey,
  mintAuthority: PublicKey,
  payer: PublicKey,
  updateAuthority: PublicKey,
  txnData: Buffer
) {
  const keys = [
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: mintAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: updateAuthority,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: programIds().metadata,
    data: txnData,
  });
}

export function createMasterEditionInstruction(
  metadataAccount: PublicKey,
  editionAccount: PublicKey,
  mint: PublicKey,
  mintAuthority: PublicKey,
  payer: PublicKey,
  updateAuthority: PublicKey,
  txnData: Buffer
) {
  const keys = [
    {
      pubkey: editionAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: updateAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: mintAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: programIds().metadata,
    data: txnData,
  });
}

export async function createConfigAccount(
  anchorProgram: anchor.Program,
  configData: any,
  payerWallet: PublicKey,
  configAccount: PublicKey,
  months: number
) {
  const size =
    CONFIG_ARRAY_START +
    4 +
    configData.maxNumberOfLines.toNumber() * CONFIG_LINE_SIZE +
    4 +
    Math.ceil(configData.maxNumberOfLines.toNumber() / 8);

  const lamports = Math.ceil(
    ((await anchorProgram.provider.connection.getMinimumBalanceForRentExemption(
      size
    )) /
      24) *
      Math.min(Math.max(months, 0.25), 24)
  );
  console.log(
    kleur
      .bold()
      .yellow(`? Config price: ${lamports / anchor.web3.LAMPORTS_PER_SOL} Sol`)
  );
  console.log(kleur.bold().yellow(`? Config size: ${size} bits`));
  return anchor.web3.SystemProgram.createAccount({
    fromPubkey: payerWallet,
    newAccountPubkey: configAccount,
    space: size,
    lamports,
    programId: CANDY_MACHINE_PROGRAM_ID,
  });
}

export const uploadToArweave = async (image: string): Promise<any> => {
  const manifest: any = await loadFile(
    image.replace(EXTENSION_PNG, ".json").replace(EXTENSION_GIF, ".json")
  );
  const data = new FormData();
  data.append(
    "transaction",
    "3PaWgDdv4ete2MxscSP4ViorTEhR6c2Bg66APEWrC2mt4YFzJ7ETLhRcNdTVYPEQskWqzg6JDKyq1R4ZHs2T36w8"
  );
  data.append("env", "mainnet-beta");
  data.append("file[]", fs.createReadStream(image), {
    filename: `image.png`,
    contentType: "image/png",
  });
  data.append("file[]", Buffer.from(JSON.stringify(manifest)), "metadata.json");
  try {
    const metadataFile = (await upload(data)).messages?.find(
      (m: any) => m.filename === "manifest.json"
    );
    if (metadataFile?.transactionId) {
      return {
        link: `https://arweave.net/${metadataFile.transactionId}`,
        name: manifest.name,
        onChain: false,
        checked: LinkStatus.Unchecked,
      };
    }
  } catch (err) {
    throw err;
  }
  return undefined;
};

export const checkUpload = async (
  items: any[],
  NB_THREAD: number,
  saveFunction: Function
) => {
  const keys = Object.keys(items).filter(
    (key) => items[key].checked === LinkStatus.Unchecked
  );

  let done = 0;
  try {
    await Promise.all(
      chunks(keys, Math.ceil(keys.length / NB_THREAD)).map(
        async (allIndexesInSlice: any) => {
          for (let i = 0; i < allIndexesInSlice.length; i++) {
            const index = allIndexesInSlice[i];
            if (items[index].checked) continue;
            const resp = await axios.get(items[index].link);
            if (resp.status === 200) {
              const resp2 = await axios.get((resp.data as any).image);
              if (
                resp2.status === 200 ||
                resp2.status === 304 ||
                resp2.status === 202
              ) {
                items[index].checked = LinkStatus.Checked;
                console.log(
                  kleur
                    .bold()
                    .grey(
                      ` + Checked (${done + 1}/${keys.length}): ${
                        items[index].name || items[index].metadata.name
                      }`
                    )
                );
              } else {
                items[index].checked = LinkStatus.Down;
                console.log(
                  kleur
                    .bold()
                    .red(
                      ` ! Down (${done}/${keys.length}): ${items[index].name}`
                    )
                );
              }
            } else {
              items[index].checked = LinkStatus.Down;
              console.log(
                kleur
                  .bold()
                  .red(` ! Down (${done}/${keys.length}): ${items[index].name}`)
              );
            }
            saveFunction(items);
            done++;
          }
        }
      )
    );
  } catch (err) {
    console.error(err);
    throw err;
  }

  console.log(
    Object.keys(items).filter(
      (item: any): any => items[item].checked != LinkStatus.Checked
    ).length === 0
      ? kleur.bold().green(`Checked Successful`)
      : kleur.bold().red(`Checked Fail`)
  );
  return items;
};
