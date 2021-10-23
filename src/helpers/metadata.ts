import { web3 } from "@project-serum/anchor";
import {
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import { deserializeUnchecked, serialize } from "borsh";
import {
  Art,
  CreateMetadataArgs,
  Data,
  Edition,
  MasterEditionV1,
  MasterEditionV2,
  Metadata,
  MetadataKey,
  METADATA_SCHEMA,
  StringPublicKey,
  UpdateMetadataArgs,
} from "../types";
import { extendBorsh } from "./borsh";
import { programIds } from "./programIds";
import { findProgramAddress, toPublicKey } from "./various";
extendBorsh();
const METADATA_REPLACE = new RegExp("\u0000", "g");

export async function updateMetadata(
  data: Data | undefined,
  newUpdateAuthority: string | undefined,
  primarySaleHappened: boolean | null | undefined,
  mintKey: StringPublicKey,
  updateAuthority: StringPublicKey,
  instructions: TransactionInstruction[],
  metadataAccount?: StringPublicKey
) {
  metadataAccount =
    metadataAccount ||
    (
      await findProgramAddress(
        [
          Buffer.from("metadata"),
          programIds().metadata.toBuffer(),
          toPublicKey(mintKey).toBuffer(),
        ],
        programIds().metadata
      )
    )[0];

  const value = new UpdateMetadataArgs({
    data,
    updateAuthority: !newUpdateAuthority ? undefined : newUpdateAuthority,
    primarySaleHappened:
      primarySaleHappened === null || primarySaleHappened === undefined
        ? null
        : primarySaleHappened,
  });
  const txnData = Buffer.from(serialize(METADATA_SCHEMA, value));
  const keys = [
    {
      pubkey: toPublicKey(metadataAccount),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(updateAuthority),
      isSigner: true,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: toPublicKey(programIds().metadata),
      data: txnData,
    })
  );

  return metadataAccount;
}

export function isValidHttpUrl(text: string) {
  if (text.startsWith("http:") || text.startsWith("https:")) {
    return true;
  }

  return false;
}

export const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer
  ) as Metadata;
  metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
  metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
  metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
  return metadata;
};

export const decodeEdition = (buffer: Buffer) => {
  return deserializeUnchecked(METADATA_SCHEMA, Edition, buffer) as Edition;
};

export const decodeMasterEdition = (
  buffer: Buffer
): MasterEditionV1 | MasterEditionV2 => {
  if (buffer[0] == MetadataKey.MasterEditionV1) {
    return deserializeUnchecked(
      METADATA_SCHEMA,
      MasterEditionV1,
      buffer
    ) as MasterEditionV1;
  } else {
    return deserializeUnchecked(
      METADATA_SCHEMA,
      MasterEditionV2,
      buffer
    ) as MasterEditionV2;
  }
};

export const processMetaData: Function = ({ account, pubkey }, setter) => {
  if (!isMetadataAccount(account)) return;

  try {
    if (isMetadataV1Account(account)) {
      const metadata = decodeMetadata(account.data);
      if (
        isValidHttpUrl(metadata.data.uri)
        // && metadata.data.uri.indexOf('arweave') >= 0
      ) {
        const parsedAccount: ParsedAccount<Metadata> = {
          pubkey,
          account,
          info: metadata,
        };
        setter("metadataByMint", metadata.mint, parsedAccount);
      }
    }

    if (isEditionV1Account(account)) {
      const edition = decodeEdition(account.data);
      const parsedAccount: ParsedAccount<Edition> = {
        pubkey,
        account,
        info: edition,
      };
      setter("editions", pubkey, parsedAccount);
    }

    if (isMasterEditionAccount(account)) {
      const masterEdition = decodeMasterEdition(account.data);

      if (isMasterEditionV1(masterEdition)) {
        const parsedAccount: ParsedAccount<MasterEditionV1> = {
          pubkey,
          account,
          info: masterEdition,
        };
        setter("masterEditions", pubkey, parsedAccount);

        setter(
          "masterEditionsByPrintingMint",
          masterEdition.printingMint,
          parsedAccount
        );

        setter(
          "masterEditionsByOneTimeAuthMint",
          masterEdition.oneTimePrintingAuthorizationMint,
          parsedAccount
        );
      } else {
        const parsedAccount: ParsedAccount<MasterEditionV2> = {
          pubkey,
          account,
          info: masterEdition,
        };
        setter("masterEditions", pubkey, parsedAccount);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
export type AccountInfo<T> = {
  /** `true` if this account's data contains a loaded program */
  executable: boolean;
  /** Identifier of the program that owns the account */
  owner: web3.PublicKey;
  /** Number of lamports assigned to the account */
  lamports: number;
  /** Optional data assigned to the account */
  data: T;
};

export interface ParsedAccountBase {
  pubkey: string;
  account: AccountInfo<Buffer>;
  info: any; // TODO: change to unknown
}

export interface ParsedAccount<T> extends ParsedAccountBase {
  info: T;
}

const isMetadataAccount = (account: AccountInfo<Buffer>) => {
  return account.owner.equals(programIds().metadata);
};

const isMetadataV1Account = (account: AccountInfo<Buffer>) =>
  account.data[0] === MetadataKey.MetadataV1;

const isEditionV1Account = (account: AccountInfo<Buffer>) =>
  account.data[0] === MetadataKey.EditionV1;

const isMasterEditionAccount = (account: AccountInfo<Buffer>) =>
  account.data[0] === MetadataKey.MasterEditionV1 ||
  account.data[0] === MetadataKey.MasterEditionV2;

const isMasterEditionV1 = (
  me: MasterEditionV1 | MasterEditionV2
): me is MasterEditionV1 => {
  return me.key === MetadataKey.MasterEditionV1;
};

export async function createMetadata(
  data: Data,
  updateAuthority: StringPublicKey,
  mintKey: StringPublicKey,
  mintAuthorityKey: StringPublicKey,
  instructions: TransactionInstruction[],
  payer: StringPublicKey
) {
  const metadataProgramId = programIds().metadata;

  const metadataAccount = (
    await findProgramAddress(
      [
        Buffer.from("metadata"),
        toPublicKey(metadataProgramId).toBuffer(),
        toPublicKey(mintKey).toBuffer(),
      ],
      toPublicKey(metadataProgramId)
    )
  )[0];
  const value = new CreateMetadataArgs({ data, isMutable: true });
  const txnData = Buffer.from(serialize(METADATA_SCHEMA, value));

  const keys = [
    {
      pubkey: toPublicKey(metadataAccount),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(mintKey),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(mintAuthorityKey),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(payer),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(updateAuthority),
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
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: toPublicKey(metadataProgramId),
      data: txnData,
    })
  );

  return metadataAccount;
}
