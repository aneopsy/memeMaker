"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mint = exports.mintSFT = exports.createSFT = exports.createMasterEdition = exports.createMint = exports.createUninitializedMint = void 0;
var types_1 = require("../types");
var anchor = __importStar(require("@project-serum/anchor"));
var borsh_1 = require("borsh");
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var transactions_1 = require("./transactions");
var various_1 = require("./various");
var instructions_1 = require("./instructions");
var constants_1 = require("./constants");
var programIds_1 = require("./programIds");
var metadata_1 = require("./metadata");
var accounts_1 = require("./accounts");
var MINT_TRANSACTION_SIZE = 5;
var BATCH_SIZE = 10;
// export async function mintEditionsToWallet(
//   art: Art,
//   wallet: any, //WalletContextState,
//   connection: Connection,
//   mintTokenAccount: any, //TokenAccount,
//   editions: number = 1,
//   mintDestination: StringPublicKey
// ) {
//   const signers: Array<Array<Keypair[]>> = [];
//   const instructions: Array<Array<TransactionInstruction[]>> = [];
//   let currSignerBatch: Array<Keypair[]> = [];
//   let currInstrBatch: Array<TransactionInstruction[]> = [];
//   let mintEditionIntoWalletSigners: Keypair[] = [];
//   let mintEditionIntoWalletInstructions: TransactionInstruction[] = [];
//   for (let i = 0; i < editions; i++) {
//     console.log("Minting", i);
//     await setupMintEditionIntoWalletInstructions(
//       art,
//       wallet,
//       connection,
//       mintTokenAccount,
//       new BN(art.supply! + 1 + i),
//       mintEditionIntoWalletInstructions,
//       mintEditionIntoWalletSigners,
//       mintDestination
//     );
//     if (mintEditionIntoWalletInstructions.length === MINT_TRANSACTION_SIZE) {
//       currSignerBatch.push(mintEditionIntoWalletSigners);
//       currInstrBatch.push(mintEditionIntoWalletInstructions);
//       mintEditionIntoWalletSigners = [];
//       mintEditionIntoWalletInstructions = [];
//     }
//     if (currInstrBatch.length === BATCH_SIZE) {
//       signers.push(currSignerBatch);
//       instructions.push(currInstrBatch);
//       currSignerBatch = [];
//       currInstrBatch = [];
//     }
//   }
//   if (
//     mintEditionIntoWalletInstructions.length < MINT_TRANSACTION_SIZE &&
//     mintEditionIntoWalletInstructions.length > 0
//   ) {
//     currSignerBatch.push(mintEditionIntoWalletSigners);
//     currInstrBatch.push(mintEditionIntoWalletInstructions);
//   }
//   if (currInstrBatch.length <= BATCH_SIZE && currInstrBatch.length > 0) {
//     signers.push(currSignerBatch);
//     instructions.push(currInstrBatch);
//   }
//   console.log("Instructions", instructions);
//   for (let i = 0; i < instructions.length; i++) {
//     const instructionBatch = instructions[i];
//     const signerBatch = signers[i];
//     console.log("Running batch", i);
//     // if (instructionBatch.length >= 2)
//     //   // Pump em through!
//     //   await sendTransactionWithRetryWithKeypair(
//     //     connection,
//     //     wallet,
//     //     instructionBatch,
//     //     signerBatch,
//     //     SequenceType.StopOnFailure,
//     //     "single"
//     //   );
//     // else
//     //   await sendTransactionWithRetryWithKeypair(
//     //     connection,
//     //     wallet,
//     //     instructionBatch[0],
//     //     signerBatch[0],
//     //     "single"
//     //   );
//     console.log("Done");
//   }
// }
// export async function setupMintEditionIntoWalletInstructions(
//   art: Art,
//   wallet: any, //WalletContextState,
//   connection: Connection,
//   mintTokenAccount: any, //TokenAccount,
//   edition: BN,
//   instructions: any,
//   signers: any,
//   mintDestination: StringPublicKey
// ) {
//   if (!art.mint) throw new Error("Art mint is not provided");
//   if (typeof art.supply === "undefined") {
//     throw new Error("Art supply is not provided");
//   }
//   if (!wallet.publicKey) throw new Error("Wallet pubKey is not provided");
//   if (!mintTokenAccount) {
//     throw new Error("Art mint token account is not provided");
//   }
//   const walletPubKey = wallet.publicKey.toString();
//   const { mint: tokenMint } = art;
//   const { pubkey: mintTokenAccountPubKey } = mintTokenAccount;
//   const mintTokenAccountOwner = mintTokenAccount.info.owner.toString();
//   const mintRentExempt = await connection.getMinimumBalanceForRentExemption(
//     MintLayout.span
//   );
//   const { mint: newMint } = await createMintAndAccountWithOne(
//     wallet,
//     mintDestination,
//     mintRentExempt,
//     instructions,
//     signers
//   );
//   await mintNewEditionFromMasterEditionViaToken(
//     newMint,
//     tokenMint,
//     walletPubKey,
//     walletPubKey,
//     mintTokenAccountOwner,
//     mintTokenAccountPubKey,
//     instructions,
//     walletPubKey,
//     edition
//   );
// }
function createUninitializedMint(instructions, payer, amount, signers) {
    var account = web3_js_1.Keypair.generate();
    instructions.push(web3_js_1.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: account.publicKey,
        lamports: amount,
        space: spl_token_1.MintLayout.span,
        programId: constants_1.TOKEN_PROGRAM_ID,
    }));
    signers.push(account);
    return account.publicKey;
}
exports.createUninitializedMint = createUninitializedMint;
function createMint(instructions, payer, mintRentExempt, decimals, owner, freezeAuthority, signers) {
    var account = createUninitializedMint(instructions, payer, mintRentExempt, signers);
    instructions.push(spl_token_1.Token.createInitMintInstruction(constants_1.TOKEN_PROGRAM_ID, account, decimals, owner, freezeAuthority));
    signers.push(signers[signers.length - 1]);
    return account;
}
exports.createMint = createMint;
function createMasterEdition(maxSupply, mintKey, updateAuthorityKey, mintAuthorityKey, payer, instructions) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataProgramId, metadataAccount, editionAccount, value, data, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadataProgramId = (0, programIds_1.programIds)().metadata;
                    return [4 /*yield*/, (0, various_1.findProgramAddress)([
                            Buffer.from(constants_1.METADATA_PREFIX),
                            (0, various_1.toPublicKey)(metadataProgramId).toBuffer(),
                            (0, various_1.toPublicKey)(mintKey).toBuffer(),
                        ], (0, various_1.toPublicKey)(metadataProgramId))];
                case 1:
                    metadataAccount = (_a.sent())[0];
                    return [4 /*yield*/, (0, various_1.findProgramAddress)([
                            Buffer.from(constants_1.METADATA_PREFIX),
                            (0, various_1.toPublicKey)(metadataProgramId).toBuffer(),
                            (0, various_1.toPublicKey)(mintKey).toBuffer(),
                            Buffer.from(constants_1.EDITION),
                        ], (0, various_1.toPublicKey)(metadataProgramId))];
                case 2:
                    editionAccount = (_a.sent())[0];
                    value = new types_1.CreateMasterEditionArgs({ maxSupply: maxSupply || null });
                    data = Buffer.from((0, borsh_1.serialize)(types_1.METADATA_SCHEMA, value));
                    keys = [
                        {
                            pubkey: (0, various_1.toPublicKey)(editionAccount),
                            isSigner: false,
                            isWritable: true,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(mintKey),
                            isSigner: false,
                            isWritable: true,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(updateAuthorityKey),
                            isSigner: true,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(mintAuthorityKey),
                            isSigner: true,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(payer),
                            isSigner: true,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(metadataAccount),
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, programIds_1.programIds)().token,
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: web3_js_1.SystemProgram.programId,
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                            isSigner: false,
                            isWritable: false,
                        },
                    ];
                    instructions.push(new web3_js_1.TransactionInstruction({
                        keys: keys,
                        programId: (0, various_1.toPublicKey)(metadataProgramId),
                        data: data,
                    }));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createMasterEdition = createMasterEdition;
// export const mintNFT = async (
//   connection: Connection,
//   wallet: any,
//   owner: PublicKey
// ) => {
//   const TOKEN_PROGRAM_ID = new PublicKey(
//     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//   );
//   //const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
//   //  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
//   //);
//   const mintAccount = new Account();
//   const tokenAccount = new Account();
//   // Allocate memory for the account
//   const mintRent = await connection.getMinimumBalanceForRentExemption(
//     MintLayout.span
//   );
//   const accountRent = await connection.getMinimumBalanceForRentExemption(
//     AccountLayout.span
//   );
//   let transaction = new Transaction();
//   const signers = [mintAccount, tokenAccount];
//   transaction.recentBlockhash = (
//     await connection.getRecentBlockhash("max")
//   ).blockhash;
//   transaction.add(
//     SystemProgram.createAccount({
//       fromPubkey: wallet.publicKey,
//       newAccountPubkey: mintAccount.publicKey,
//       lamports: mintRent,
//       space: MintLayout.span,
//       programId: TOKEN_PROGRAM_ID,
//     })
//   );
//   transaction.add(
//     SystemProgram.createAccount({
//       fromPubkey: wallet.publicKey,
//       newAccountPubkey: tokenAccount.publicKey,
//       lamports: accountRent,
//       space: AccountLayout.span,
//       programId: TOKEN_PROGRAM_ID,
//     })
//   );
//   transaction.add(
//     Token.createInitMintInstruction(
//       TOKEN_PROGRAM_ID,
//       mintAccount.publicKey,
//       0,
//       wallet.publicKey,
//       wallet.publicKey
//     )
//   );
//   transaction.add(
//     Token.createInitAccountInstruction(
//       TOKEN_PROGRAM_ID,
//       mintAccount.publicKey,
//       tokenAccount.publicKey,
//       owner
//     )
//   );
//   transaction.add(
//     Token.createMintToInstruction(
//       TOKEN_PROGRAM_ID,
//       mintAccount.publicKey,
//       tokenAccount.publicKey,
//       wallet.publicKey,
//       [],
//       1
//     )
//   );
//   transaction.add(
//     Token.createSetAuthorityInstruction(
//       TOKEN_PROGRAM_ID,
//       mintAccount.publicKey,
//       null,
//       "MintTokens",
//       wallet.publicKey,
//       []
//     )
//   );
//   transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
//   if (signers.length > 0) {
//     transaction.partialSign(...signers);
//   }
//   transaction = await wallet.signTransaction(transaction);
//   const rawTransaction = transaction.serialize();
//   const options = {
//     skipPreflight: true,
//     commitment: "singleGossip",
//   };
//   const txid = await connection.sendRawTransaction(rawTransaction, options);
//   return { txid, mint: mintAccount.publicKey, account: tokenAccount.publicKey };
// };
var createSFT = function (connection, wallet, metadata) { return __awaiter(void 0, void 0, void 0, function () {
    var mintRent, payerPublicKey, instructions, signers, mint, mintKey, recipientKey, txid, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey))
                    return [2 /*return*/];
                return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span)];
            case 1:
                mintRent = _b.sent();
                payerPublicKey = wallet.publicKey.toBase58();
                instructions = [];
                signers = [];
                return [4 /*yield*/, spl_token_1.Token.createMint(connection, wallet, wallet.publicKey, wallet.publicKey, 0, constants_1.TOKEN_PROGRAM_ID)];
            case 2:
                mint = _b.sent();
                mintKey = mint.publicKey;
                return [4 /*yield*/, (0, various_1.findProgramAddress)([
                        wallet.publicKey.toBuffer(),
                        (0, programIds_1.programIds)().token.toBuffer(),
                        (0, various_1.toPublicKey)(mintKey).toBuffer(),
                    ], (0, programIds_1.programIds)().associatedToken)];
            case 3:
                recipientKey = (_b.sent())[0];
                instructions.push((0, instructions_1.createAssociatedTokenAccountInstruction)((0, various_1.toPublicKey)(recipientKey), wallet.publicKey, wallet.publicKey, (0, various_1.toPublicKey)(mintKey)));
                return [4 /*yield*/, (0, metadata_1.createMetadata)(metadata, payerPublicKey, mintKey.toBase58(), payerPublicKey, instructions, wallet.publicKey.toBase58())];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, transactions_1.sendTransactionWithRetryWithKeypair)(connection, wallet, instructions, signers)];
            case 5:
                txid = (_b.sent()).txid;
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, connection.confirmTransaction(txid, "max")];
            case 7:
                _b.sent();
                console.log("+ Token Address " + mintKey.toBase58());
                console.log("+ recipientKey " + recipientKey);
                return [3 /*break*/, 9];
            case 8:
                _a = _b.sent();
                console.error("Tx not confirmed: " + txid);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, txid];
        }
    });
}); };
exports.createSFT = createSFT;
var mintSFT = function (connection, wallet, walletDest, mintKey) { return __awaiter(void 0, void 0, void 0, function () {
    var done;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                done = 0;
                return [4 /*yield*/, Promise.all((0, various_1.chunks)(Array.from(Array(walletDest.length).keys()), 10).map(function (wallets) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _i, i, instructions, signers, index, dest, recipientKey, res;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = [];
                                    for (_b in wallets)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    i = _a[_i];
                                    done += 1;
                                    instructions = [];
                                    signers = [];
                                    index = wallets[i];
                                    dest = walletDest[index];
                                    console.log("+ (" + done + " / " + walletDest.length + ") Create a mint for " + dest);
                                    return [4 /*yield*/, (0, various_1.findProgramAddress)([
                                            (0, various_1.toPublicKey)(dest).toBuffer(),
                                            (0, programIds_1.programIds)().token.toBuffer(),
                                            (0, various_1.toPublicKey)(mintKey).toBuffer(),
                                        ], (0, programIds_1.programIds)().associatedToken)];
                                case 2:
                                    recipientKey = (_c.sent())[0];
                                    instructions.push((0, instructions_1.createAssociatedTokenAccountInstruction)((0, various_1.toPublicKey)(recipientKey), (0, various_1.toPublicKey)(wallet.publicKey), (0, various_1.toPublicKey)(dest), (0, various_1.toPublicKey)(mintKey)));
                                    instructions.push(spl_token_1.Token.createMintToInstruction((0, various_1.toPublicKey)(constants_1.TOKEN_PROGRAM_ID), (0, various_1.toPublicKey)(mintKey), (0, various_1.toPublicKey)(recipientKey), (0, various_1.toPublicKey)(wallet.publicKey), [], 1));
                                    return [4 /*yield*/, (0, transactions_1.sendTransactionWithRetryWithKeypair)(connection, wallet, instructions, signers)];
                                case 3:
                                    res = _c.sent();
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.mintSFT = mintSFT;
function mint(keypair, env, configAddress, dest, splTokenAccountKey) {
    return __awaiter(this, void 0, void 0, function () {
        var mint, userKeyPair, anchorProgram, userTokenAccountAddress, uuid, _a, candyMachineAddress, candyMachine, remainingAccounts, metadataAddress, masterEdition, _b, _c, _d, _e;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    mint = web3_js_1.Keypair.generate();
                    userKeyPair = (0, accounts_1.loadWalletKey)(keypair);
                    return [4 /*yield*/, (0, accounts_1.loadAnchorProgram)(userKeyPair, env)];
                case 1:
                    anchorProgram = _h.sent();
                    return [4 /*yield*/, (0, accounts_1.getTokenWallet)(
                        // userKeyPair.publicKey,
                        dest, mint.publicKey)];
                case 2:
                    userTokenAccountAddress = _h.sent();
                    uuid = (0, accounts_1.uuidFromConfigPubkey)(configAddress);
                    return [4 /*yield*/, (0, accounts_1.getCandyMachineAddress)(configAddress, uuid)];
                case 3:
                    _a = __read.apply(void 0, [_h.sent(), 1]), candyMachineAddress = _a[0];
                    return [4 /*yield*/, anchorProgram.account.candyMachine.fetch(candyMachineAddress)];
                case 4:
                    candyMachine = _h.sent();
                    remainingAccounts = [];
                    return [4 /*yield*/, (0, accounts_1.getMetadata)(mint.publicKey)];
                case 5:
                    metadataAddress = _h.sent();
                    return [4 /*yield*/, (0, accounts_1.getMasterEdition)(mint.publicKey)];
                case 6:
                    masterEdition = _h.sent();
                    _c = (_b = anchorProgram.rpc).mintNft;
                    _f = {
                        accounts: {
                            config: configAddress,
                            candyMachine: candyMachineAddress,
                            payer: userKeyPair.publicKey,
                            //@ts-ignore
                            wallet: candyMachine.wallet,
                            mint: mint.publicKey,
                            metadata: metadataAddress,
                            masterEdition: masterEdition,
                            mintAuthority: userKeyPair.publicKey,
                            updateAuthority: userKeyPair.publicKey,
                            tokenMetadataProgram: constants_1.TOKEN_METADATA_PROGRAM_ID,
                            tokenProgram: constants_1.TOKEN_PROGRAM_ID,
                            systemProgram: web3_js_1.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        },
                        signers: [mint, userKeyPair],
                        remainingAccounts: remainingAccounts
                    };
                    _e = (_d = anchor.web3.SystemProgram).createAccount;
                    _g = {
                        fromPubkey: userKeyPair.publicKey,
                        newAccountPubkey: mint.publicKey,
                        space: spl_token_1.MintLayout.span
                    };
                    return [4 /*yield*/, anchorProgram.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span)];
                case 7: return [4 /*yield*/, _c.apply(_b, [(_f.instructions = [
                            _e.apply(_d, [(_g.lamports = _h.sent(),
                                    _g.programId = constants_1.TOKEN_PROGRAM_ID,
                                    _g)]),
                            spl_token_1.Token.createInitMintInstruction(constants_1.TOKEN_PROGRAM_ID, mint.publicKey, 0, userKeyPair.publicKey, userKeyPair.publicKey),
                            (0, instructions_1.createAssociatedTokenAccountInstruction)(userTokenAccountAddress, userKeyPair.publicKey, dest, mint.publicKey),
                            spl_token_1.Token.createMintToInstruction(constants_1.TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, userKeyPair.publicKey, [], 1)
                        ],
                            _f)])];
                case 8: return [2 /*return*/, _h.sent()];
            }
        });
    });
}
exports.mint = mint;
//# sourceMappingURL=mint.js.map