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
var canvas_1 = require("canvas");
var merge_images_1 = __importDefault(require("merge-images"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var dna_1 = require("./helpers/dna");
var tables_1 = require("./helpers/tables");
var app = (0, express_1.default)();
var port = process.env.PORT || 8081;
function createGif(file, fromFolder, toFolder, algorithm) {
    if (algorithm === void 0) { algorithm = "neuquant"; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveMain) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, width, height, canvas2, ctx2, parts, img, dstPath, writeStream, encoder, canvas, ctx, _loop_1, i;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    var image = new canvas_1.Image();
                                    image.onload = function () { return resolve([image.width, image.height]); };
                                    image.src = path_1.default.join(fromFolder, file + ".png");
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
                                img.src = path_1.default.join(fromFolder, file + ".png");
                                dstPath = path_1.default.join(toFolder, file + ".gif");
                                writeStream = fs.createWriteStream(dstPath);
                                writeStream.on("close", function () {
                                    resolveMain();
                                });
                                encoder = new GIFEncoder(height, height, algorithm, true, 12);
                                encoder.createReadStream().pipe(writeStream);
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
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
app.get("/gif/:dna", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, dna, unsequenced, order, basePath, images, b64, img, headers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = req.params;
                dna = params === null || params === void 0 ? void 0 : params.dna;
                unsequenced = (0, dna_1.unsequence)(dna);
                order = [0, 1, 6, 5, 4, 3, 2];
                basePath = path_1.default.join(__dirname, "../", "images/");
                images = order.map(function (id) {
                    return path_1.default.join(basePath, tables_1.attributeTable[id].name, unsequenced[id].value + ".png");
                });
                return [4 /*yield*/, (0, merge_images_1.default)(images, { Canvas: canvas_1.Canvas, Image: canvas_1.Image })];
            case 1:
                b64 = _a.sent();
                img = Buffer.from(b64.replace(/^data:image\/png;base64,/, ""), "base64");
                headers = { "Content-Type": "image/png", "Content-Length": img.length };
                res.writeHead(200, headers);
                res.end(img);
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
app.get("/", function (req, res) { return res.send("You have reached the Pixsols Generator"); });
app.listen(port, function () {
    console.log("Pixsols Generator listening at on port " + port);
});
//# sourceMappingURL=index.js.map