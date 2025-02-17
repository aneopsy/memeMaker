"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.uuidFromConfigPubkey = exports.loadAnchorProgram = exports.loadWalletKey = exports.getAtaForMint = exports.getMasterEdition = exports.getMetadata = exports.getConfig = exports.getCandyMachineAddress = exports.getTokenWallet = exports.createConfig = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("./constants");
var anchor = __importStar(require("@project-serum/anchor"));
var fs_1 = __importDefault(require("fs"));
var instructions_1 = require("./instructions");
var programIds_1 = require("./programIds");
// const idlCandy = JSON.parse(
//   require("fs").readFileSync("./src/idl/aneo_candy_machine.json", "utf8")
// );
var createConfig = function (anchorProgram, payerWallet, configData, months) {
    return __awaiter(this, void 0, void 0, function () {
        var configAccount, uuid, _a, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    configAccount = web3_js_1.Keypair.generate();
                    uuid = configAccount.publicKey.toBase58().slice(0, 6);
                    _d = {
                        config: configAccount.publicKey,
                        uuid: uuid
                    };
                    _b = (_a = anchorProgram.rpc).initializeConfig;
                    _c = [__assign({ uuid: uuid }, configData)];
                    _e = {
                        accounts: {
                            config: configAccount.publicKey,
                            authority: payerWallet.publicKey,
                            payer: payerWallet.publicKey,
                            systemProgram: web3_js_1.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                        },
                        signers: [payerWallet, configAccount]
                    };
                    return [4 /*yield*/, (0, instructions_1.createConfigAccount)(anchorProgram, configData, payerWallet.publicKey, configAccount.publicKey, months)];
                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([(_e.instructions = [
                            _f.sent()
                        ],
                            _e)]))];
                case 2: return [2 /*return*/, (_d.txId = _f.sent(),
                        _d)];
            }
        });
    });
};
exports.createConfig = createConfig;
var getTokenWallet = function (mint, wallet) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([wallet.toBuffer(), constants_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], constants_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
};
exports.getTokenWallet = getTokenWallet;
var getCandyMachineAddress = function (config, uuid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([Buffer.from(constants_1.CANDY_MACHINE), config.toBuffer(), Buffer.from(uuid)], constants_1.CANDY_MACHINE_PROGRAM_ID)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getCandyMachineAddress = getCandyMachineAddress;
var getConfig = function (authority, uuid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([Buffer.from(constants_1.CANDY_MACHINE), authority.toBuffer(), Buffer.from(uuid)], constants_1.CANDY_MACHINE_PROGRAM_ID)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getConfig = getConfig;
var getMetadata = function (mint) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                    Buffer.from("metadata"),
                    (0, programIds_1.programIds)().metadata.toBuffer(),
                    mint.toBuffer(),
                ], (0, programIds_1.programIds)().metadata)];
            case 1: return [2 /*return*/, (_a.sent())[0]];
        }
    });
}); };
exports.getMetadata = getMetadata;
var getMasterEdition = function (mint) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                    Buffer.from("metadata"),
                    (0, programIds_1.programIds)().metadata.toBuffer(),
                    mint.toBuffer(),
                    Buffer.from("edition"),
                ], (0, programIds_1.programIds)().metadata)];
            case 1: return [2 /*return*/, (_a.sent())[0]];
        }
    });
}); };
exports.getMasterEdition = getMasterEdition;
var getAtaForMint = function (mint, buyer) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!web3_js_1.PublicKey.isOnCurve(buyer.toBuffer())) {
                    throw new Error("Buyer cannot sign: " + buyer.toString());
                }
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([buyer.toBuffer(), constants_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], constants_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAtaForMint = getAtaForMint;
function loadWalletKey(keypair) {
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync(keypair).toString())));
}
exports.loadWalletKey = loadWalletKey;
function loadAnchorProgram(walletKeyPair, env) {
    return __awaiter(this, void 0, void 0, function () {
        var solConnection, walletWrapper, provider, idl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    solConnection = new anchor.web3.Connection("https://api." + env + ".solana.com/");
                    walletWrapper = new anchor.Wallet(walletKeyPair);
                    provider = new anchor.Provider(solConnection, walletWrapper, {
                        preflightCommitment: "recent",
                    });
                    return [4 /*yield*/, anchor.Program.fetchIdl(constants_1.CANDY_MACHINE_PROGRAM_ID, provider)];
                case 1:
                    idl = _a.sent();
                    return [2 /*return*/, new anchor.Program(idl, constants_1.CANDY_MACHINE_PROGRAM_ID, provider)];
            }
        });
    });
}
exports.loadAnchorProgram = loadAnchorProgram;
function uuidFromConfigPubkey(configAccount) {
    return configAccount.toBase58().slice(0, 6);
}
exports.uuidFromConfigPubkey = uuidFromConfigPubkey;
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
//# sourceMappingURL=accounts.js.map