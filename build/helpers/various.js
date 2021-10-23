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
exports.shortenAddress = exports.replaceAll = exports.escapeRegExp = exports.shuffle = exports.reverse = exports.notUnique = exports.unique = exports.arrRemoveValue = exports.remove = exports.pickRandomObject = exports.pickRandom = exports.pickRandomAndRemove = exports.randomNumber = exports.loadFile = exports.fileExist = exports.readDir = exports.saveFile = exports.writeFile = exports.sleep = exports.toPublicKey = exports.findProgramAddress = exports.upload = exports.parsePrice = exports.saveCache = exports.loadCache = exports.cachePath = exports.chunks = exports.fromUTF8Array = exports.getUnixTs = exports.array2Buffer = exports.buffer2Array = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("./constants");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var anchor_1 = require("@project-serum/anchor");
function buffer2Array(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return view;
}
exports.buffer2Array = buffer2Array;
function array2Buffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
exports.array2Buffer = array2Buffer;
var getUnixTs = function () { return new Date().getTime() / 1000; };
exports.getUnixTs = getUnixTs;
function fromUTF8Array(data, clean) {
    if (clean === void 0) { clean = false; }
    var str = "", i;
    for (i = 0; i < data.length; i++) {
        var value = data[i];
        if (clean && String.fromCharCode(value) == "\x00")
            continue;
        if (value < 0x80) {
            str += String.fromCharCode(value);
        }
        else if (value > 0xbf && value < 0xe0) {
            str += String.fromCharCode(((value & 0x1f) << 6) | (data[i + 1] & 0x3f));
            i += 1;
        }
        else if (value > 0xdf && value < 0xf0) {
            str += String.fromCharCode(((value & 0x0f) << 12) |
                ((data[i + 1] & 0x3f) << 6) |
                (data[i + 2] & 0x3f));
            i += 2;
        }
        else {
            // surrogate pair
            var charCode = (((value & 0x07) << 18) |
                ((data[i + 1] & 0x3f) << 12) |
                ((data[i + 2] & 0x3f) << 6) |
                (data[i + 3] & 0x3f)) -
                0x010000;
            str += String.fromCharCode((charCode >> 10) | 0xd800, (charCode & 0x03ff) | 0xdc00);
            i += 3;
        }
    }
    return str;
}
exports.fromUTF8Array = fromUTF8Array;
var chunks = function (array, size) {
    return array.length
        ? Array.apply(0, new Array(Math.ceil(array.length / size))).map(function (_, index) {
            return array.slice(index * size, (index + 1) * size);
        })
        : array;
};
exports.chunks = chunks;
function cachePath(env, cacheName) {
    return path_1.default.join(constants_1.CACHE_PATH, env + "-" + cacheName + ".json");
}
exports.cachePath = cachePath;
function loadCache(cacheName, env) {
    var path = cachePath(env, cacheName);
    console.log(path);
    return fs_1.default.existsSync(path)
        ? JSON.parse(fs_1.default.readFileSync(path).toString())
        : undefined;
}
exports.loadCache = loadCache;
var saveCache = function (cacheName, env, cacheContent) {
    return fs_1.default.writeFileSync(cachePath(env, cacheName), JSON.stringify(cacheContent, null, 2));
};
exports.saveCache = saveCache;
var parsePrice = function (price) {
    return Math.ceil(parseFloat(price) * web3_js_1.LAMPORTS_PER_SOL);
};
exports.parsePrice = parsePrice;
var upload = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, node_fetch_1.default)("https://us-central1-principal-lane-200702.cloudfunctions.net/uploadFile4", {
                    method: "POST",
                    body: data,
                })];
            case 1: return [4 /*yield*/, (_a.sent()).json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.upload = upload;
var findProgramAddress = function (seeds, programId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor_1.web3.PublicKey.findProgramAddress(seeds, programId)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, [result[0].toBase58(), result[1]]];
        }
    });
}); };
exports.findProgramAddress = findProgramAddress;
var toPublicKey = function (key) {
    return typeof key !== "string" ? key : new anchor_1.web3.PublicKey(key);
};
exports.toPublicKey = toPublicKey;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
var writeFile = function (file, obj) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.promises.writeFile(file, JSON.stringify(obj, null, 2))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.writeFile = writeFile;
var saveFile = function (cacheName, cacheContent) {
    return fs_1.default.writeFileSync(cacheName, JSON.stringify(cacheContent, null, 2));
};
exports.saveFile = saveFile;
var readDir = function (basePath) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fs_1.default.promises.readdir(basePath)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.readDir = readDir;
var fileExist = function (s) {
    return new Promise(function (r) { return fs_1.default.access(s, fs_1.default.constants.F_OK, function (e) { return r(!e); }); });
};
exports.fileExist = fileExist;
var loadFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, exports.fileExist)(file)];
            case 1:
                if (!_c.sent()) return [3 /*break*/, 3];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, fs_1.default.promises.readFile(file)];
            case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                throw error_1;
            case 5: return [2 /*return*/, null];
        }
    });
}); };
exports.loadFile = loadFile;
var randomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};
exports.randomNumber = randomNumber;
var pickRandomAndRemove = function (arr) {
    var toPick = (0, exports.randomNumber)(0, arr.length - 1);
    return (0, exports.remove)(arr, toPick);
};
exports.pickRandomAndRemove = pickRandomAndRemove;
var pickRandom = function (arr) { return (0, exports.randomNumber)(0, arr.length - 1); };
exports.pickRandom = pickRandom;
var pickRandomObject = function (arr) {
    return arr[(0, exports.randomNumber)(0, arr.length - 1)];
};
exports.pickRandomObject = pickRandomObject;
var remove = function (arr, toPick) { return arr.splice(toPick, 1); };
exports.remove = remove;
var arrRemoveValue = function (arr, value) {
    return arr.filter(function (ele) { return ele != value; });
};
exports.arrRemoveValue = arrRemoveValue;
var unique = function (value, index, self) {
    return self.indexOf(value) === index;
};
exports.unique = unique;
var notUnique = function (value, index, self) {
    return self.indexOf(value) !== index;
};
exports.notUnique = notUnique;
var reverse = function (s) { return s.split("").reverse().join(""); };
exports.reverse = reverse;
var shuffle = function (array) {
    var _a;
    var currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = __read([
            array[randomIndex],
            array[currentIndex],
        ], 2), array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
    return array;
};
exports.shuffle = shuffle;
var escapeRegExp = function (string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}; // $& means the whole matched string
exports.escapeRegExp = escapeRegExp;
var replaceAll = function (str, find, replace) {
    return str.replace(new RegExp((0, exports.escapeRegExp)(find), "g"), replace);
};
exports.replaceAll = replaceAll;
var shortenAddress = function (address, chars) {
    if (chars === void 0) { chars = 4; }
    return address.slice(0, chars) + "..." + address.slice(-chars);
};
exports.shortenAddress = shortenAddress;
//# sourceMappingURL=various.js.map