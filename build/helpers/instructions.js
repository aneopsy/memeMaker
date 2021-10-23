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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpload = exports.uploadToArweave = exports.createConfigAccount = exports.createMasterEditionInstruction = exports.createMetadataInstruction = exports.createAssociatedTokenAccountInstruction = void 0;
var web3_js_1 = require("@solana/web3.js");
var fs = __importStar(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var kleur_1 = __importDefault(require("kleur"));
var constants_1 = require("./constants");
var anchor = __importStar(require("@project-serum/anchor"));
var various_1 = require("./various");
var axios_1 = __importDefault(require("axios"));
var types_1 = require("../types");
var programIds_1 = require("./programIds");
function createAssociatedTokenAccountInstruction(associatedTokenAddress, payer, walletAddress, splTokenMintAddress) {
    var keys = [
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
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: constants_1.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: constants_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
    });
}
exports.createAssociatedTokenAccountInstruction = createAssociatedTokenAccountInstruction;
function createMetadataInstruction(metadataAccount, mint, mintAuthority, payer, updateAuthority, txnData) {
    var keys = [
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
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: (0, programIds_1.programIds)().metadata,
        data: txnData,
    });
}
exports.createMetadataInstruction = createMetadataInstruction;
function createMasterEditionInstruction(metadataAccount, editionAccount, mint, mintAuthority, payer, updateAuthority, txnData) {
    var keys = [
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
            pubkey: constants_1.TOKEN_PROGRAM_ID,
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
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: (0, programIds_1.programIds)().metadata,
        data: txnData,
    });
}
exports.createMasterEditionInstruction = createMasterEditionInstruction;
function createConfigAccount(anchorProgram, configData, payerWallet, configAccount, months) {
    return __awaiter(this, void 0, void 0, function () {
        var size, lamports, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    size = constants_1.CONFIG_ARRAY_START +
                        4 +
                        configData.maxNumberOfLines.toNumber() * constants_1.CONFIG_LINE_SIZE +
                        4 +
                        Math.ceil(configData.maxNumberOfLines.toNumber() / 8);
                    _b = (_a = Math).ceil;
                    return [4 /*yield*/, anchorProgram.provider.connection.getMinimumBalanceForRentExemption(size)];
                case 1:
                    lamports = _b.apply(_a, [((_c.sent()) /
                            24) *
                            Math.min(Math.max(months, 0.25), 24)]);
                    console.log(kleur_1.default
                        .bold()
                        .yellow("? Config price: " + lamports / anchor.web3.LAMPORTS_PER_SOL + " Sol"));
                    console.log(kleur_1.default.bold().yellow("? Config size: " + size + " bits"));
                    return [2 /*return*/, anchor.web3.SystemProgram.createAccount({
                            fromPubkey: payerWallet,
                            newAccountPubkey: configAccount,
                            space: size,
                            lamports: lamports,
                            programId: constants_1.CANDY_MACHINE_PROGRAM_ID,
                        })];
            }
        });
    });
}
exports.createConfigAccount = createConfigAccount;
var uploadToArweave = function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var manifest, data, metadataFile, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, various_1.loadFile)(image.replace(constants_1.EXTENSION_PNG, ".json").replace(constants_1.EXTENSION_GIF, ".json"))];
            case 1:
                manifest = _b.sent();
                data = new form_data_1.default();
                data.append("transaction", "3PaWgDdv4ete2MxscSP4ViorTEhR6c2Bg66APEWrC2mt4YFzJ7ETLhRcNdTVYPEQskWqzg6JDKyq1R4ZHs2T36w8");
                data.append("env", "mainnet-beta");
                data.append("file[]", fs.createReadStream(image), {
                    filename: "image.png",
                    contentType: "image/png",
                });
                data.append("file[]", Buffer.from(JSON.stringify(manifest)), "metadata.json");
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, various_1.upload)(data)];
            case 3:
                metadataFile = (_a = (_b.sent()).messages) === null || _a === void 0 ? void 0 : _a.find(function (m) { return m.filename === "manifest.json"; });
                if (metadataFile === null || metadataFile === void 0 ? void 0 : metadataFile.transactionId) {
                    return [2 /*return*/, {
                            link: "https://arweave.net/" + metadataFile.transactionId,
                            name: manifest.name,
                            onChain: false,
                            checked: types_1.LinkStatus.Unchecked,
                        }];
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                throw err_1;
            case 5: return [2 /*return*/, undefined];
        }
    });
}); };
exports.uploadToArweave = uploadToArweave;
var checkUpload = function (items, NB_THREAD, saveFunction) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, done, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keys = Object.keys(items).filter(function (key) { return items[key].checked === types_1.LinkStatus.Unchecked; });
                done = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.all((0, various_1.chunks)(keys, Math.ceil(keys.length / NB_THREAD)).map(function (allIndexesInSlice) { return __awaiter(void 0, void 0, void 0, function () {
                        var i, index, resp, resp2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < allIndexesInSlice.length)) return [3 /*break*/, 7];
                                    index = allIndexesInSlice[i];
                                    if (items[index].checked)
                                        return [3 /*break*/, 6];
                                    return [4 /*yield*/, axios_1.default.get(items[index].link)];
                                case 2:
                                    resp = _a.sent();
                                    if (!(resp.status === 200)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, axios_1.default.get(resp.data.image)];
                                case 3:
                                    resp2 = _a.sent();
                                    if (resp2.status === 200 ||
                                        resp2.status === 304 ||
                                        resp2.status === 202) {
                                        items[index].checked = types_1.LinkStatus.Checked;
                                        console.log(kleur_1.default
                                            .bold()
                                            .grey(" + Checked (" + (done + 1) + "/" + keys.length + "): " + (items[index].name || items[index].metadata.name)));
                                    }
                                    else {
                                        items[index].checked = types_1.LinkStatus.Down;
                                        console.log(kleur_1.default
                                            .bold()
                                            .red(" ! Down (" + done + "/" + keys.length + "): " + items[index].name));
                                    }
                                    return [3 /*break*/, 5];
                                case 4:
                                    items[index].checked = types_1.LinkStatus.Down;
                                    console.log(kleur_1.default
                                        .bold()
                                        .red(" ! Down (" + done + "/" + keys.length + "): " + items[index].name));
                                    _a.label = 5;
                                case 5:
                                    saveFunction(items);
                                    done++;
                                    _a.label = 6;
                                case 6:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                throw err_2;
            case 4:
                console.log(Object.keys(items).filter(function (item) { return items[item].checked != types_1.LinkStatus.Checked; }).length === 0
                    ? kleur_1.default.bold().green("Checked Successful")
                    : kleur_1.default.bold().red("Checked Fail"));
                return [2 /*return*/, items];
        }
    });
}); };
exports.checkUpload = checkUpload;
//# sourceMappingURL=instructions.js.map