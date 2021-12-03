import { PublicKey } from "@solana/web3.js";

// export const CANDY_MACHINE = "aneox_machine"; //candy_machine
export const CANDY_MACHINE = "candy_machine"; //candy_machine

export const PAYMENT_WALLET = new PublicKey(
  "HvwC9QSAzvGXhhVrgPmauVwFWcYZhne3hVot9EbHuFTm"
);
export const CANDY_MACHINE_PROGRAM_ID = new PublicKey(
  "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ"
  // "4xFiypfMenDR66fBT4dvNPm23i1eZ71CcUyRS5QGSckA"
);
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);
export const BPF_UPGRADE_LOADER_ID = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);
export const MEMO_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);
export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export const VAULT_ID = new PublicKey(
  "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn"
);
export const AUCTION_ID = new PublicKey(
  "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8"
);
export const METAPLEX_ID = new PublicKey(
  "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
);
export const PROXY_ID = new PublicKey(
  "2pLoaUJgn4UkQuPRtba6mq3qf25Ds4PKCUet3H9Vhihh"
);

export const RPC_MAINNET_BETA =
  "https://quiet-silent-surf.solana-mainnet.quiknode.pro/27c92aaf663ad7c61b87bdbc3947a1cc81318507/";
export const RPC_DEVNET =
  // "https://summer-dawn-dawn.solana-devnet.quiknode.pro/0d2290f61d21e281ac2dd8b7f87fc6bc74f48b6a/";
  "https://bitter-bitter-river.solana-devnet.quiknode.pro/2ea3194e68b148d27f2867f8270c6dd21f643d55/";

export const SYSTEM = new PublicKey("11111111111111111111111111111111");

export const METADATA_PREFIX = "metadata";
export const EDITION = "edition";

export const CONFIG_ARRAY_START =
  32 + // authority
  4 +
  6 + // uuid + u32 len
  4 +
  10 + // u32 len + symbol
  2 + // seller fee basis points
  1 +
  4 +
  5 * 34 + // optional + u32 len + actual vec
  8 + //max supply
  1 + //is mutable
  1 + // retain authority
  4; // max number of lines;
export const CONFIG_LINE_SIZE = 4 + 32 + 4 + 200;

export const CACHE_PATH = "./.cache";

export const DEFAULT_TIMEOUT = 30000;

export const EXTENSION_PNG = ".png";
export const EXTENSION_GIF = ".gif";
export const EXTENSION_JSON = ".json";
