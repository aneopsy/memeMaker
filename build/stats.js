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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = require("./helpers/connection");
var various_1 = require("./helpers/various");
var aws_1 = require("./helpers/aws");
var axios_1 = __importDefault(require("axios"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var THREADS = 50;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, attributeTable, s3List, metadatas, done, total, stats, _loop_1, _a, _b, _i, attributeIndex, howrareis, ranks;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                connection = (0, connection_1.getConnection)("mainnet-beta");
                return [4 /*yield*/, (0, aws_1.getAttributeTable)()];
            case 1:
                attributeTable = _c.sent();
                return [4 /*yield*/, (0, aws_1.listS3)("pixsols-metadatas")];
            case 2:
                s3List = (_c.sent())
                    .filter(function (x) { return x.Key.startsWith("pixsols/"); })
                    .map(function (x) { return x.Key; });
                metadatas = [];
                done = 0;
                return [4 /*yield*/, Promise.all((0, various_1.chunks)(s3List, Math.ceil(s3List.length / THREADS)).map(function (metadatasIds) { return __awaiter(void 0, void 0, void 0, function () {
                        var metadatasIds_1, metadatasIds_1_1, metadatasId, _a, _b, e_1_1;
                        var e_1, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 5, 6, 7]);
                                    metadatasIds_1 = __values(metadatasIds), metadatasIds_1_1 = metadatasIds_1.next();
                                    _d.label = 1;
                                case 1:
                                    if (!!metadatasIds_1_1.done) return [3 /*break*/, 4];
                                    metadatasId = metadatasIds_1_1.value;
                                    _b = (_a = metadatas).push;
                                    return [4 /*yield*/, axios_1.default.get("https://pixsols-metadatas.s3.amazonaws.com/" + metadatasId)];
                                case 2:
                                    _b.apply(_a, [(_d.sent()).data]);
                                    console.log("+ load metadatas " + done++);
                                    _d.label = 3;
                                case 3:
                                    metadatasIds_1_1 = metadatasIds_1.next();
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 7];
                                case 6:
                                    try {
                                        if (metadatasIds_1_1 && !metadatasIds_1_1.done && (_c = metadatasIds_1.return)) _c.call(metadatasIds_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _c.sent();
                total = metadatas.length;
                stats = {};
                metadatas.map(function (metadata) {
                    metadata.attributes.map(function (attr) {
                        if (attr["trait_type"] === "Rank")
                            return;
                        if (!stats.hasOwnProperty(attr["trait_type"]))
                            stats[attr["trait_type"]] = {};
                        if (!stats[attr["trait_type"]][attr.value])
                            stats[attr["trait_type"]][attr.value] = 0;
                        stats[attr["trait_type"]][attr.value] += (1 / total) * 100;
                    });
                });
                _loop_1 = function (attributeIndex) {
                    var done_1;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                done_1 = 0;
                                return [4 /*yield*/, Promise.all((0, various_1.chunks)(Array.from(Array(attributeTable[attributeIndex].items.length).keys()), Math.ceil(attributeTable[attributeIndex].items.length / THREADS)).map(function (attributeItems) { return __awaiter(void 0, void 0, void 0, function () {
                                        var attributeItems_1, attributeItems_1_1, attributeItemIndex, _a, _b, e_2_1;
                                        var e_2, _c, _d;
                                        var _e;
                                        return __generator(this, function (_f) {
                                            switch (_f.label) {
                                                case 0:
                                                    _f.trys.push([0, 7, 8, 9]);
                                                    attributeItems_1 = __values(attributeItems), attributeItems_1_1 = attributeItems_1.next();
                                                    _f.label = 1;
                                                case 1:
                                                    if (!!attributeItems_1_1.done) return [3 /*break*/, 6];
                                                    attributeItemIndex = attributeItems_1_1.value;
                                                    _a = attributeTable[attributeIndex].items[attributeItemIndex];
                                                    _d = {};
                                                    if (!attributeTable[attributeIndex].items[attributeItemIndex].mint) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, connection.getTokenSupply((0, various_1.toPublicKey)(attributeTable[attributeIndex].items[attributeItemIndex]
                                                            .mint))];
                                                case 2:
                                                    _b = (_f.sent()).value.uiAmount;
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    _b = null;
                                                    _f.label = 4;
                                                case 4:
                                                    _a.stats = (_d.sft = _b,
                                                        _d.apply = ((_e = stats[attributeTable[attributeIndex].name]) === null || _e === void 0 ? void 0 : _e[attributeTable[attributeIndex].items[attributeItemIndex].name]) || 0,
                                                        _d);
                                                    console.log("+ attributeTable " + done_1++ + " - " + attributeTable[attributeIndex].items[attributeItemIndex].mint);
                                                    _f.label = 5;
                                                case 5:
                                                    attributeItems_1_1 = attributeItems_1.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_2_1 = _f.sent();
                                                    e_2 = { error: e_2_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (attributeItems_1_1 && !attributeItems_1_1.done && (_c = attributeItems_1.return)) _c.call(attributeItems_1);
                                                    }
                                                    finally { if (e_2) throw e_2.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    }); }))];
                            case 1:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a = [];
                for (_b in attributeTable)
                    _a.push(_b);
                _i = 0;
                _c.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                attributeIndex = _a[_i];
                return [5 /*yield**/, _loop_1(attributeIndex)];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                howrareis = metadatas.reduce(function (acc, metadata) {
                    var score = metadata.attributes.reduce(function (acc, attr) {
                        if (attr["trait_type"] === "Rank")
                            return acc;
                        acc += 1 / stats[attr["trait_type"]][attr.value];
                        return acc;
                    }, 0);
                    acc.push({ id: metadata.id, score: score });
                    return acc;
                }, []);
                ranks = howrareis
                    .sort(function (a, b) { return b.score - a.score; })
                    .map(function (a, rank) { return (__assign(__assign({}, a), { rank: rank + 1 + "/" + total })); });
                return [4 /*yield*/, Promise.all((0, various_1.chunks)(ranks, Math.ceil(ranks.length / THREADS)).map(function (ranks) { return __awaiter(void 0, void 0, void 0, function () {
                        var _loop_2, ranks_1, ranks_1_1, rank, e_3_1;
                        var e_3, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _loop_2 = function (rank) {
                                        var pixsolKey, metadata, index;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    pixsolKey = (0, sha256_1.default)("PIXSOLS" + String(rank.id));
                                                    metadata = metadatas.find(function (x) { return x.id === rank.id; });
                                                    index = metadata.attributes.findIndex(function (attr) { return attr["trait_type"] === "Rank"; });
                                                    if (index > -1) {
                                                        metadata.attributes.splice(index, 1);
                                                    }
                                                    metadata.attributes.push({ trait_type: "Rank", value: rank.rank });
                                                    return [4 /*yield*/, (0, aws_1.uploadS3)("pixsols-metadatas", "pixsols/" + pixsolKey + ".json", JSON.stringify(metadata, null, 2))];
                                                case 1:
                                                    _c.sent();
                                                    console.log("+ update rank #" + rank.rank + " - " + rank.id);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, 7, 8]);
                                    ranks_1 = __values(ranks), ranks_1_1 = ranks_1.next();
                                    _b.label = 2;
                                case 2:
                                    if (!!ranks_1_1.done) return [3 /*break*/, 5];
                                    rank = ranks_1_1.value;
                                    return [5 /*yield**/, _loop_2(rank)];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4:
                                    ranks_1_1 = ranks_1.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_3_1 = _b.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (ranks_1_1 && !ranks_1_1.done && (_a = ranks_1.return)) _a.call(ranks_1);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 8:
                _c.sent();
                return [4 /*yield*/, (0, aws_1.uploadS3)("pixsols-config", "attributes.json", JSON.stringify({ timestamp: Date.now(), attributes: attributeTable }, null, 2))];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=stats.js.map