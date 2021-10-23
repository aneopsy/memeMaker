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
var express_1 = __importDefault(require("express"));
var bs58_1 = __importDefault(require("bs58"));
var nacl = __importStar(require("tweetnacl"));
var axios_1 = __importDefault(require("axios"));
var anchor = __importStar(require("@project-serum/anchor"));
var connection_1 = require("./helpers/connection");
var accounts_1 = require("./helpers/accounts");
var various_1 = require("./helpers/various");
var metadata_1 = require("./helpers/metadata");
var gif_1 = require("./helpers/gif");
var dna_1 = require("./helpers/dna");
var transactions_1 = require("./helpers/transactions");
var app = (0, express_1.default)();
app.use(express_1.default.json());
var port = process.env.PORT || 8081;
app.get("/gif/:dna", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, dna, gif;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = req.params;
                dna = params === null || params === void 0 ? void 0 : params.dna;
                return [4 /*yield*/, (0, gif_1.generateGif)((0, dna_1.unsequence)(dna))];
            case 1:
                gif = _a.sent();
                res.writeHead(200, {
                    "Content-Type": "image/gif",
                    "Content-Length": gif.length,
                });
                res.end(gif);
                return [2 /*return*/];
        }
    });
}); });
app.post("/gif", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, sequenced, gif;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                sequenced = (0, dna_1.sequence)(body);
                return [4 /*yield*/, (0, gif_1.generateGif)((0, dna_1.unsequence)(sequenced))];
            case 1:
                gif = _a.sent();
                res.writeHead(200, {
                    "Content-Type": "image/gif",
                    "Content-Length": gif.length,
                });
                res.end(gif);
                return [2 /*return*/];
        }
    });
}); });
app.get("/decode/:dna", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, dna, unsequenced, headers;
    return __generator(this, function (_a) {
        params = req.params;
        dna = params === null || params === void 0 ? void 0 : params.dna;
        unsequenced = (0, dna_1.unsequence)(dna);
        headers = { "Content-Type": "application/json" };
        res.writeHead(200, headers);
        res.end(JSON.stringify(unsequenced));
        return [2 /*return*/];
    });
}); });
app.post("/encode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, sequenced, headers;
    return __generator(this, function (_a) {
        body = req.body;
        sequenced = (0, dna_1.sequence)(body);
        headers = { "Content-Type": "application/json" };
        res.writeHead(200, headers);
        res.end(JSON.stringify(sequenced));
        return [2 /*return*/];
    });
}); });
app.post("/merge", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var timeValidation, authority, connection, walletKeyPair, headers, body, signature, data, signer, verify, pixsolMint, fetched, newAttr, metadataKey, metadataAccount, pixsolData, metadata, gif, newUri, _a, instructions, tx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                timeValidation = 1000 * 60;
                authority = "Piiiij2D83a4TUosdUuA8hJZCRS8sfYvNLAPEw8P7tm";
                connection = (0, connection_1.getConnection)("mainnet-beta");
                console.log(process.env);
                walletKeyPair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.PRIVATE_KEY)));
                headers = { "Content-Type": "application/json" };
                body = req.body;
                signature = body.signature, data = body.data, signer = body.signer;
                verify = nacl.sign.detached.verify(new TextEncoder().encode(JSON.stringify(data)), bs58_1.default.decode(signature), bs58_1.default.decode(signer));
                if (!verify) {
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({ error: "Invalid signature" }));
                    return [2 /*return*/];
                }
                if (data.timestamp + timeValidation < Date.now()) {
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({ error: "Request is outdated" }));
                    return [2 /*return*/];
                }
                pixsolMint = data.params.address;
                console.log("pixsolAddr", pixsolMint);
                //
                // VERIFICATION ON CHAIN FOR ATTR
                //
                console.log("###############################################");
                return [4 /*yield*/, connection.getParsedConfirmedTransactions([data.params.tx])];
            case 1:
                fetched = (_b.sent())[0];
                if (fetched === null || !fetched.meta.status.hasOwnProperty("Ok")) {
                    res.writeHead(200, headers);
                    res.end(JSON.stringify({ error: "Invalid Tx" }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, fetched.transaction.message.instructions
                        .map(function (element) {
                        var _a;
                        if (((_a = element === null || element === void 0 ? void 0 : element.parsed) === null || _a === void 0 ? void 0 : _a.type) === "transferChecked") {
                            return element.parsed.info;
                        }
                    })
                        .filter(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = tx &&
                                        tx.authority === authority &&
                                        tx.tokenAmount.amount === 1;
                                    if (!_a) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, accounts_1.getTokenWallet)((0, various_1.toPublicKey)(signer), (0, various_1.toPublicKey)(tx.mint))];
                                case 1:
                                    _b = (_c.sent()) ===
                                        tx.source;
                                    if (!_b) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, accounts_1.getTokenWallet)((0, various_1.toPublicKey)(authority), (0, various_1.toPublicKey)(tx.mint))];
                                case 2:
                                    _b = (_c.sent());
                                    _c.label = 3;
                                case 3:
                                    _a = (_b) === tx.destination;
                                    _c.label = 4;
                                case 4: return [2 /*return*/, _a];
                            }
                        });
                    }); })];
            case 2:
                newAttr = _b.sent();
                console.log(JSON.stringify(newAttr, null, 2));
                return [4 /*yield*/, (0, accounts_1.getMetadata)((0, various_1.toPublicKey)(pixsolMint))];
            case 3:
                metadataKey = _b.sent();
                return [4 /*yield*/, connection.getAccountInfo(metadataKey)];
            case 4:
                metadataAccount = _b.sent();
                pixsolData = (0, metadata_1.decodeMetadata)(metadataAccount.data).data;
                return [4 /*yield*/, axios_1.default.get(pixsolData.uri)];
            case 5:
                metadata = (_b.sent()).data;
                metadata.attributes = (0, dna_1.replaceAttr)(metadata.attributes, {
                    trait_type: "Background",
                    value: "Red",
                });
                return [4 /*yield*/, (0, gif_1.generateGif)(metadata.attributes)];
            case 6:
                gif = _b.sent();
                _b.label = 7;
            case 7:
                _b.trys.push([7, 9, , 10]);
                return [4 /*yield*/, (0, gif_1.update2Arweave)(metadata, gif)];
            case 8:
                newUri = _b.sent();
                return [3 /*break*/, 10];
            case 9:
                _a = _b.sent();
                return [3 /*break*/, 10];
            case 10:
                if (!newUri) return [3 /*break*/, 7];
                _b.label = 11;
            case 11:
                pixsolData.uri = newUri;
                instructions = [];
                return [4 /*yield*/, (0, metadata_1.updateMetadata)(pixsolData, undefined, undefined, pixsolMint, walletKeyPair.publicKey.toBase58(), instructions, metadataKey.toBase58())];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, transactions_1.sendTransactionWithRetryWithKeypair)(connection, walletKeyPair, instructions, [], "confirmed")];
            case 13:
                tx = _b.sent();
                console.log("+ (" + pixsolData.name + ") " + pixsolMint + " updated | tx: " + tx.txid);
                console.log("rename", pixsolData);
                console.log("###############################################");
                res.writeHead(200, headers);
                res.end("ok");
                return [2 /*return*/];
        }
    });
}); });
//
// OTHERS
//
app.get("/", function (req, res) { return res.send("You have reached the Pixsols Generator"); });
app.listen(port, function () {
    console.log("Pixsols Generator listening at on port " + port);
});
//# sourceMappingURL=index.js.map