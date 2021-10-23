"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENSION_JSON = exports.EXTENSION_GIF = exports.EXTENSION_PNG = exports.DEFAULT_TIMEOUT = exports.CACHE_PATH = exports.CONFIG_LINE_SIZE = exports.CONFIG_ARRAY_START = exports.EDITION = exports.METADATA_PREFIX = exports.SYSTEM = exports.RPC_DEVNET = exports.RPC_MAINNET_BETA = exports.PROXY_ID = exports.METAPLEX_ID = exports.AUCTION_ID = exports.VAULT_ID = exports.METADATA_PROGRAM_ID = exports.MEMO_ID = exports.BPF_UPGRADE_LOADER_ID = exports.WRAPPED_SOL_MINT = exports.TOKEN_PROGRAM_ID = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = exports.CANDY_MACHINE_PROGRAM_ID = exports.PAYMENT_WALLET = exports.CANDY_MACHINE = void 0;
var web3_js_1 = require("@solana/web3.js");
// export const CANDY_MACHINE = "aneox_machine"; //candy_machine
exports.CANDY_MACHINE = "candy_machine"; //candy_machine
exports.PAYMENT_WALLET = new web3_js_1.PublicKey("HvwC9QSAzvGXhhVrgPmauVwFWcYZhne3hVot9EbHuFTm");
exports.CANDY_MACHINE_PROGRAM_ID = new web3_js_1.PublicKey("cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ"
// "4xFiypfMenDR66fBT4dvNPm23i1eZ71CcUyRS5QGSckA"
);
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
exports.TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
exports.BPF_UPGRADE_LOADER_ID = new web3_js_1.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
exports.MEMO_ID = new web3_js_1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
exports.METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
exports.VAULT_ID = new web3_js_1.PublicKey("vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn");
exports.AUCTION_ID = new web3_js_1.PublicKey("auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8");
exports.METAPLEX_ID = new web3_js_1.PublicKey("p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98");
exports.PROXY_ID = new web3_js_1.PublicKey("2pLoaUJgn4UkQuPRtba6mq3qf25Ds4PKCUet3H9Vhihh");
exports.RPC_MAINNET_BETA = "https://quiet-silent-surf.solana-mainnet.quiknode.pro/27c92aaf663ad7c61b87bdbc3947a1cc81318507/";
exports.RPC_DEVNET = 
// "https://summer-dawn-dawn.solana-devnet.quiknode.pro/0d2290f61d21e281ac2dd8b7f87fc6bc74f48b6a/";
"https://bitter-bitter-river.solana-devnet.quiknode.pro/2ea3194e68b148d27f2867f8270c6dd21f643d55/";
exports.SYSTEM = new web3_js_1.PublicKey("11111111111111111111111111111111");
exports.METADATA_PREFIX = "metadata";
exports.EDITION = "edition";
exports.CONFIG_ARRAY_START = 32 + // authority
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
exports.CONFIG_LINE_SIZE = 4 + 32 + 4 + 200;
exports.CACHE_PATH = "./.cache";
exports.DEFAULT_TIMEOUT = 30000;
exports.EXTENSION_PNG = ".png";
exports.EXTENSION_GIF = ".gif";
exports.EXTENSION_JSON = ".json";
//# sourceMappingURL=constants.js.map