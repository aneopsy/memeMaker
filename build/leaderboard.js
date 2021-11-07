"use strict";
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
var anchor_1 = require("@project-serum/anchor");
var kleur_1 = __importDefault(require("kleur"));
var connection_1 = require("./helpers/connection");
var various_1 = require("./helpers/various");
var pixsols_1 = __importDefault(require("./helpers/pixsols"));
var aws_1 = require("./helpers/aws");
var THREADS = 20;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, mints, holders, exclude, done;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connection = (0, connection_1.getConnection)("mainnet-beta");
                mints = pixsols_1.default;
                holders = {};
                exclude = [
                    "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr",
                    "GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp",
                    "3D49QorJyNaL4rcpiynbuS3pRH4Y7EXEM6v6ZGaqfFGK",
                    "4pUQS4Jo2dsfWzt3VgHXy3H6RYnEDd11oWPiaM2rdAPw", //alphaArtMarket
                ];
                done = 0;
                return [4 /*yield*/, Promise.all((0, various_1.chunks)(mints, Math.ceil(mints.length / THREADS)).map(function (mintAddresses) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _i, index, mint, owners, ownerAccount, accountInfo;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = [];
                                    for (_b in mintAddresses)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    index = _a[_i];
                                    mint = mintAddresses[index];
                                    return [4 /*yield*/, connection.getTokenLargestAccounts(new anchor_1.web3.PublicKey(mint))];
                                case 2:
                                    owners = _c.sent();
                                    ownerAccount = owners.value[0].address;
                                    return [4 /*yield*/, connection.getParsedAccountInfo(ownerAccount)];
                                case 3:
                                    accountInfo = (_c.sent()).value;
                                    if (accountInfo && "parsed" in accountInfo.data) {
                                        if (exclude.includes(accountInfo.data.parsed.info.owner)) {
                                            console.log("Exclude Marketplace");
                                            done++;
                                            return [3 /*break*/, 4];
                                        }
                                        holders[mint] = accountInfo.data.parsed.info.owner;
                                        console.log("+ (" + done++ + "/" + mints.length + ")");
                                    }
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
                console.log(kleur_1.default.bold().yellow("Total: " + Object.keys(holders).length));
                return [4 /*yield*/, (0, aws_1.uploadS3)("pixsols-config", "leaderboard.json", JSON.stringify({ timestamp: Date.now(), holders: holders }))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=leaderboard.js.map