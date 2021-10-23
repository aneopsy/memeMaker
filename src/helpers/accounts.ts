import { Keypair, PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import {
  CANDY_MACHINE,
  CANDY_MACHINE_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "./constants";
import * as anchor from "@project-serum/anchor";
import fs from "fs";
import { createConfigAccount } from "./instructions";
import log from "loglevel";
import { programIds } from "./programIds";
// const idlCandy = JSON.parse(
//   require("fs").readFileSync("./src/idl/aneo_candy_machine.json", "utf8")
// );

export const createConfig = async function (
  anchorProgram: anchor.Program,
  payerWallet: Keypair,
  configData: {
    maxNumberOfLines: anchor.BN;
    symbol: string;
    sellerFeeBasisPoints: number;
    isMutable: boolean;
    maxSupply: anchor.BN;
    retainAuthority: boolean;
    creators: {
      address: PublicKey;
      verified: boolean;
      share: number;
    }[];
  },
  months: number
) {
  const configAccount = Keypair.generate();
  const uuid = configAccount.publicKey.toBase58().slice(0, 6);

  return {
    config: configAccount.publicKey,
    uuid,
    txId: await anchorProgram.rpc.initializeConfig(
      {
        uuid,
        ...configData,
      },
      {
        accounts: {
          config: configAccount.publicKey,
          authority: payerWallet.publicKey,
          payer: payerWallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [payerWallet, configAccount],
        instructions: [
          await createConfigAccount(
            anchorProgram,
            configData,
            payerWallet.publicKey,
            configAccount.publicKey,
            months
          ),
        ],
      }
    ),
  };
};

export const getTokenWallet = async function (
  wallet: PublicKey,
  mint: PublicKey
) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
};

export const getCandyMachineAddress = async (
  config: anchor.web3.PublicKey,
  uuid: string
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), config.toBuffer(), Buffer.from(uuid)],
    CANDY_MACHINE_PROGRAM_ID
  );
};

export const getConfig = async (
  authority: anchor.web3.PublicKey,
  uuid: string
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), authority.toBuffer(), Buffer.from(uuid)],
    CANDY_MACHINE_PROGRAM_ID
  );
};

export const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        programIds().metadata.toBuffer(),
        mint.toBuffer(),
      ],
      programIds().metadata
    )
  )[0];
};

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        programIds().metadata.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      programIds().metadata
    )
  )[0];
};

export const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};
export function loadWalletKey(keypair: string): Keypair {
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString()))
  );
}

export async function loadAnchorProgram(walletKeyPair: Keypair, env: string) {
  const solConnection = new anchor.web3.Connection(
    `https://api.${env}.solana.com/`
  );
  const walletWrapper = new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: "recent",
  });
  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider);

  return new anchor.Program(idl, CANDY_MACHINE_PROGRAM_ID, provider);
}

export function uuidFromConfigPubkey(configAccount: PublicKey) {
  return configAccount.toBase58().slice(0, 6);
}

// export async function loadCandyProgram(
//   walletKeyPair: Keypair,
//   solConnection: Connection
// ) {
//   const walletWrapper = new anchor.Wallet(walletKeyPair);
//   const provider = new anchor.Provider(solConnection, walletWrapper, {
//     preflightCommitment: "recent",
//   });

//   const program = new anchor.Program(
//     idlCandy,
//     CANDY_MACHINE_PROGRAM_ID,
//     provider
//   );
//   log.debug("program id from anchor", program.programId.toBase58());
//   return program;
// }
