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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeTable = exports.uploadS3 = exports.downloadS3 = exports.uploadImageS3 = exports.downloadImageS3 = exports.downloadAttrS3 = exports.listS3 = exports.paginateListObjectsV2 = exports.isExistS3 = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
function isExistS3(bucket, attachmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, headErr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3
                            .headObject({
                            Bucket: bucket,
                            Key: attachmentId,
                        })
                            .promise()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    headErr_1 = _a.sent();
                    if (headErr_1.code === "NotFound") {
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.isExistS3 = isExistS3;
function paginateListObjectsV2(bucket) {
    return __asyncGenerator(this, arguments, function paginateListObjectsV2_1() {
        var s3, opts, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    opts = {
                        Bucket: bucket,
                        MaxKeys: 2147483647,
                        ContinuationToken: null,
                    };
                    _a.label = 2;
                case 2: return [4 /*yield*/, __await(s3.listObjectsV2(opts).promise())];
                case 3:
                    data = _a.sent();
                    opts.ContinuationToken = data.NextContinuationToken;
                    return [4 /*yield*/, __await(data)];
                case 4: return [4 /*yield*/, _a.sent()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (opts.ContinuationToken) return [3 /*break*/, 2];
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    throw err_1;
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.paginateListObjectsV2 = paginateListObjectsV2;
function listS3(bucket) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function () {
        var totalFiles, _c, _d, data, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    totalFiles = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _c = __asyncValues(paginateListObjectsV2(bucket));
                    _e.label = 2;
                case 2: return [4 /*yield*/, _c.next()];
                case 3:
                    if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                    data = _d.value;
                    totalFiles.push.apply(totalFiles, __spreadArray([], __read(((_b = data.Contents) !== null && _b !== void 0 ? _b : [])), false));
                    _e.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(_d && !_d.done && (_a = _c.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(_c)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, totalFiles];
            }
        });
    });
}
exports.listS3 = listS3;
function downloadAttrS3(attachmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    return [4 /*yield*/, s3
                            .getObject({
                            Bucket: "pixsols-attributes",
                            Key: attachmentId, // path to the object you're looking for
                        })
                            .promise()];
                case 1:
                    file = _a.sent();
                    return [2 /*return*/, file.Body];
            }
        });
    });
}
exports.downloadAttrS3 = downloadAttrS3;
function downloadImageS3(attachmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, file, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3
                            .getObject({
                            Bucket: "pixsols-images",
                            Key: attachmentId,
                        })
                            .promise()];
                case 2:
                    file = _a.sent();
                    console.log("File downloaded successfully");
                    return [2 /*return*/, file.Body];
                case 3:
                    err_2 = _a.sent();
                    throw err_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.downloadImageS3 = downloadImageS3;
function uploadImageS3(file, key) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, data, s3Err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3
                            .upload({
                            Bucket: "pixsols-images",
                            Key: key,
                            Body: file,
                        })
                            .promise()];
                case 2:
                    data = _a.sent();
                    console.log("File uploaded successfully at " + data.Location);
                    return [3 /*break*/, 4];
                case 3:
                    s3Err_1 = _a.sent();
                    throw s3Err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.uploadImageS3 = uploadImageS3;
function downloadS3(bucket, attachmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, file, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3
                            .getObject({
                            Bucket: bucket,
                            Key: attachmentId,
                        })
                            .promise()];
                case 2:
                    file = _a.sent();
                    return [2 /*return*/, file.Body];
                case 3:
                    err_3 = _a.sent();
                    throw err_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.downloadS3 = downloadS3;
function uploadS3(bucket, key, file) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, s3Err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s3 = new aws_sdk_1.default.S3();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3
                            .upload({
                            Bucket: bucket,
                            Key: key,
                            Body: file,
                        })
                            .promise()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    s3Err_2 = _a.sent();
                    throw s3Err_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.uploadS3 = uploadS3;
var getAttributeTable = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, downloadS3("pixsols-config", "attributes.json")];
            case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])
                    .attributes];
        }
    });
}); };
exports.getAttributeTable = getAttributeTable;
//# sourceMappingURL=aws.js.map