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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update2Arweave = exports.generateCrop = exports.generateSample = exports.generateGif = exports.getAttrFromId = exports.getAttrFromMint = exports.checkDNA = void 0;
var canvas_1 = require("canvas");
var merge_images_1 = __importDefault(require("merge-images"));
var gif_encoder_2_1 = __importDefault(require("gif-encoder-2"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var various_1 = require("./various");
var aws_1 = require("./aws");
var dna_1 = require("./dna");
var fs_1 = __importDefault(require("fs"));
var general_1 = require("../config/general");
var checkDNA = function (dna) {
    return new RegExp("[0-9A-Fa-f]{" + 4 * general_1.NBR_ATTRIBUTE + "}", "g").test(dna);
};
exports.checkDNA = checkDNA;
function createGif(b64, algorithm) {
    if (algorithm === void 0) { algorithm = "neuquant"; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveMain) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, width, height, canvas2, ctx2, parts, img, encoder, canvas, ctx, _loop_1, i;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    var image = new canvas_1.Image();
                                    image.onload = function () { return resolve([image.width, image.height]); };
                                    image.src = b64;
                                })];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), width = _a[0], height = _a[1];
                                canvas2 = (0, canvas_1.createCanvas)(height, height);
                                ctx2 = canvas2.getContext("2d");
                                parts = [];
                                img = new canvas_1.Image();
                                img.onload = function () {
                                    var w2 = img.width / 12;
                                    for (var i = 0; i < 12; i++) {
                                        var x = w2 * i;
                                        canvas2.width = height;
                                        canvas2.height = height;
                                        ctx2.drawImage(img, x, 0, height, height, 0, 0, height, height);
                                        parts.push(canvas2.toDataURL());
                                    }
                                };
                                img.src = b64;
                                encoder = new gif_encoder_2_1.default(height, height, algorithm, true, 12);
                                encoder.start();
                                encoder.setDelay(100);
                                encoder.setQuality(30);
                                canvas = (0, canvas_1.createCanvas)(height, height);
                                ctx = canvas.getContext("2d");
                                _loop_1 = function (i) {
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                                    var image = new canvas_1.Image();
                                                    image.onload = function () {
                                                        ctx.drawImage(image, 0, 0);
                                                        encoder.addFrame(ctx);
                                                        resolve();
                                                    };
                                                    image.src = parts[i];
                                                })];
                                            case 1:
                                                _c.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                i = 0;
                                _b.label = 2;
                            case 2:
                                if (!(i < 12)) return [3 /*break*/, 5];
                                return [5 /*yield**/, _loop_1(i)];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 2];
                            case 5:
                                encoder.finish();
                                resolveMain(encoder.out.getData());
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function createSample(b64) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveMain) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _, height, canvas2, ctx2, img;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    var image = new canvas_1.Image();
                                    image.onload = function () { return resolve([image.width, image.height]); };
                                    image.src = b64;
                                })];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), _ = _a[0], height = _a[1];
                                canvas2 = (0, canvas_1.createCanvas)(height, height);
                                ctx2 = canvas2.getContext("2d");
                                img = new canvas_1.Image();
                                img.onload = function () {
                                    canvas2.width = height;
                                    canvas2.height = height;
                                    ctx2.drawImage(img, 0, 0, height, height, 0, 0, height, height);
                                    resolveMain(canvas2.toDataURL());
                                };
                                img.src = b64;
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function removeImageBlanks(imageObject) {
    var imgWidth = imageObject.width;
    var imgHeight = imageObject.height;
    var canvas = (0, canvas_1.createCanvas)(imgWidth, imgHeight);
    var context = canvas.getContext("2d");
    context.drawImage(imageObject, 0, 0);
    var imageData = context.getImageData(0, 0, imgWidth, imgHeight), data = imageData.data, getRBG = function (x, y) {
        var offset = imgWidth * y + x;
        return {
            red: data[offset * 4],
            green: data[offset * 4 + 1],
            blue: data[offset * 4 + 2],
            opacity: data[offset * 4 + 3],
        };
    }, isWhite = function (rgb) {
        return (rgb.opacity === 0 ||
            (rgb.red > 200 && rgb.green > 200 && rgb.blue > 200));
    }, scanY = function (fromTop) {
        var offset = fromTop ? 1 : -1;
        // loop through each row
        for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? y < imgHeight : y > -1; y += offset) {
            // loop through each column
            for (var x = 0; x < imgWidth; x++) {
                var rgb = getRBG(x, y);
                if (!isWhite(rgb)) {
                    if (fromTop) {
                        return y;
                    }
                    else {
                        return Math.min(y + 1, imgHeight);
                    }
                }
            }
        }
        return null; // all image is white
    }, scanX = function (fromLeft) {
        var offset = fromLeft ? 1 : -1;
        // loop through each column
        for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? x < imgWidth : x > -1; x += offset) {
            // loop through each row
            for (var y = 0; y < imgHeight; y++) {
                var rgb = getRBG(x, y);
                if (!isWhite(rgb)) {
                    if (fromLeft) {
                        return x;
                    }
                    else {
                        return Math.min(x + 1, imgWidth);
                    }
                }
            }
        }
        return null; // all image is white
    };
    var cropTop = scanY(true), cropBottom = scanY(false), cropLeft = scanX(true), cropRight = scanX(false), cropWidth = cropRight - cropLeft, cropHeight = cropBottom - cropTop;
    var border = 20;
    canvas.width = cropWidth + border * 2;
    canvas.height = cropHeight + border * 2;
    var refRes = { width: 224, height: 224 };
    var scale = Math.min(refRes.width / canvas.width, refRes.height / canvas.height);
    var origin = {
        x: 0,
        y: 0,
    };
    var ctx = canvas.getContext("2d");
    // finally crop the guy
    ctx.drawImage(imageObject, cropLeft, cropTop, cropWidth, cropHeight, border, border, cropWidth, cropHeight);
    var canvas2 = (0, canvas_1.createCanvas)(refRes.width, refRes.height);
    var context2 = canvas2.getContext("2d");
    context2.setTransform(scale, 0, 0, scale, origin.x, origin.y);
    context2.drawImage(canvas, 0, 0);
    context2.setTransform(1, 0, 0, 1, 0, 0);
    return canvas2.toDataURL();
}
function createCrop(b64) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveMain) { return __awaiter(_this, void 0, void 0, function () {
                    var img, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                img = new canvas_1.Image();
                                img.onload = function () {
                                    resolveMain(removeImageBlanks(img));
                                };
                                _a = img;
                                return [4 /*yield*/, createSample(b64)];
                            case 1:
                                _a.src = _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
var orderAttr = function (attr) { return __awaiter(void 0, void 0, void 0, function () {
    var attributeTable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, aws_1.getAttributeTable)()];
            case 1:
                attributeTable = (_a.sent()).attributes;
                return [2 /*return*/, general_1.ORDER.map(function (id) { return ({
                        trait_type: attributeTable[id].name,
                        value: attr.find(function (a) { return a.trait_type === attributeTable[id].name; }).value,
                    }); })];
        }
    });
}); };
var getAttrFromMint = function (mint) { return __awaiter(void 0, void 0, void 0, function () {
    var attributeTable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, aws_1.getAttributeTable)()];
            case 1:
                attributeTable = (_a.sent()).attributes;
                return [2 /*return*/, attributeTable.reduce(function (acc, val) {
                        if (val.items.find(function (x) { return x.mint === mint; }))
                            return {
                                trait_type: val.name,
                                value: val.items.find(function (x) { return x.mint === mint; }).name,
                            };
                        return acc;
                    }, null)];
        }
    });
}); };
exports.getAttrFromMint = getAttrFromMint;
var getAttrFromId = function (attributeId, traitId) { return __awaiter(void 0, void 0, void 0, function () {
    var attributeTable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, aws_1.getAttributeTable)()];
            case 1:
                attributeTable = (_a.sent()).attributes;
                return [2 /*return*/, attributeTable.reduce(function (acc, val) {
                        if (val.id === attributeId)
                            return {
                                trait_type: val.name,
                                value: val.items.find(function (x) { return x.id === traitId; }).name,
                            };
                        return acc;
                    }, null)];
        }
    });
}); };
exports.getAttrFromId = getAttrFromId;
var generateGif = function (dna) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, unsequenced, images, _d, _e, b64, gif;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(0, exports.checkDNA)(dna))
                    throw new Error("Wrong DNA");
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 10]);
                _b = (_a = Buffer).from;
                return [4 /*yield*/, (0, aws_1.downloadImageS3)("gif/" + dna + ".gif")];
            case 2: return [2 /*return*/, _b.apply(_a, [_f.sent()])];
            case 3:
                _c = _f.sent();
                return [4 /*yield*/, (0, dna_1.unsequence)(dna)];
            case 4:
                unsequenced = _f.sent();
                _e = (_d = Promise).all;
                return [4 /*yield*/, orderAttr(unsequenced)];
            case 5: return [4 /*yield*/, _e.apply(_d, [(_f.sent()).map(function (attr) {
                        return (0, aws_1.downloadAttrS3)(path_1.default.join(attr.trait_type, attr.value + ".png"));
                    })])];
            case 6:
                images = _f.sent();
                return [4 /*yield*/, (0, merge_images_1.default)(images, { Canvas: canvas_1.Canvas, Image: canvas_1.Image })];
            case 7:
                b64 = _f.sent();
                return [4 /*yield*/, createGif(b64)];
            case 8:
                gif = _f.sent();
                return [4 /*yield*/, (0, aws_1.uploadImageS3)(gif, "gif/" + dna + ".gif")];
            case 9:
                _f.sent();
                return [2 /*return*/, gif];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.generateGif = generateGif;
var generateSample = function (dna) { return __awaiter(void 0, void 0, void 0, function () {
    var unsequenced, images, _a, _b, b64, sample;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(0, exports.checkDNA)(dna))
                    throw new Error("Wrong DNA");
                return [4 /*yield*/, (0, dna_1.unsequence)(dna)];
            case 1:
                unsequenced = _c.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, orderAttr(unsequenced)];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (attr) {
                        return (0, aws_1.downloadAttrS3)(path_1.default.join(attr.trait_type, attr.value + ".png"));
                    })])];
            case 3:
                images = _c.sent();
                return [4 /*yield*/, (0, merge_images_1.default)(images, { Canvas: canvas_1.Canvas, Image: canvas_1.Image })];
            case 4:
                b64 = _c.sent();
                return [4 /*yield*/, createSample(b64)];
            case 5:
                sample = _c.sent();
                return [4 /*yield*/, (0, aws_1.uploadS3)(general_1.BUCKET_ID, sample, "images/" + dna + ".png")];
            case 6:
                _c.sent();
                return [2 /*return*/, sample];
        }
    });
}); };
exports.generateSample = generateSample;
var generateCrop = function (dna) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, unsequenced, images, _d, _e, frame, b64, crop, final;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(0, exports.checkDNA)(dna))
                    throw new Error("Wrong DNA");
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 11]);
                _b = (_a = Buffer).from;
                return [4 /*yield*/, (0, aws_1.downloadImageS3)("crop/" + dna + ".png")];
            case 2: return [2 /*return*/, _b.apply(_a, [_f.sent()])];
            case 3:
                _c = _f.sent();
                return [4 /*yield*/, (0, dna_1.unsequence)(dna)];
            case 4:
                unsequenced = _f.sent();
                _e = (_d = Promise).all;
                return [4 /*yield*/, orderAttr(unsequenced)];
            case 5: return [4 /*yield*/, _e.apply(_d, [(_f.sent()).map(function (attr) {
                        return (0, aws_1.downloadAttrS3)(path_1.default.join(attr.trait_type, attr.value + ".png"));
                    })])];
            case 6:
                images = _f.sent();
                frame = fs_1.default.readFileSync("./src/img/frame.png");
                return [4 /*yield*/, (0, merge_images_1.default)(images, { Canvas: canvas_1.Canvas, Image: canvas_1.Image })];
            case 7:
                b64 = _f.sent();
                return [4 /*yield*/, createCrop(b64)];
            case 8:
                crop = _f.sent();
                return [4 /*yield*/, (0, merge_images_1.default)([crop, frame], {
                        Canvas: canvas_1.Canvas,
                        Image: canvas_1.Image,
                    })];
            case 9:
                final = _f.sent();
                return [4 /*yield*/, (0, aws_1.uploadImageS3)(final, "crop/" + dna + ".png")];
            case 10:
                _f.sent();
                return [2 /*return*/, final];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.generateCrop = generateCrop;
var update2Arweave = function (manifest, image) { return __awaiter(void 0, void 0, void 0, function () {
    var data, uri, metadataFile, resp, resp2, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                data = new form_data_1.default();
                uri = undefined;
                manifest.image = "image.gif";
                manifest.properties.files[0].uri = "image.gif";
                data.append("transaction", "3PaWgDdv4ete2MxscSP4ViorTEhR6c2Bg66APEWrC2mt4YFzJ7ETLhRcNdTVYPEQskWqzg6JDKyq1R4ZHs2T36w8");
                data.append("env", "mainnet-beta");
                data.append("file[]", image, "image.gif");
                data.append("file[]", JSON.stringify(manifest), "metadata.json");
                _c.label = 1;
            case 1:
                _c.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, various_1.upload)(data)];
            case 2:
                metadataFile = (_b = (_c.sent()).messages) === null || _b === void 0 ? void 0 : _b.find(function (m) { return m.filename === "manifest.json"; });
                if (!(metadataFile === null || metadataFile === void 0 ? void 0 : metadataFile.transactionId)) return [3 /*break*/, 7];
                uri = "https://arweave.net/" + metadataFile.transactionId;
                return [4 /*yield*/, axios_1.default.get(uri)];
            case 3:
                resp = _c.sent();
                if (!(resp.status === 200)) return [3 /*break*/, 5];
                return [4 /*yield*/, axios_1.default.get(resp.data.image)];
            case 4:
                resp2 = _c.sent();
                if (resp2.status !== 200 &&
                    resp2.status !== 304 &&
                    resp2.status !== 202) {
                    throw new Error("Link down");
                }
                return [3 /*break*/, 6];
            case 5: throw new Error("Link down");
            case 6: return [3 /*break*/, 8];
            case 7: throw new Error("Link down");
            case 8: return [3 /*break*/, 10];
            case 9:
                _a = _c.sent();
                throw new Error("Error during upload");
            case 10: return [2 /*return*/, uri];
        }
    });
}); };
exports.update2Arweave = update2Arweave;
//# sourceMappingURL=gif.js.map