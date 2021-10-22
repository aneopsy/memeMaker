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
var canvas_1 = require("canvas");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var dna_1 = require("./helpers/dna");
var tables_1 = require("./helpers/tables");
var app = (0, express_1.default)();
var port = process.env.PORT || 8081;
app.get("/gif/:dna", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, dna, unsequenced, order, basePath, images, b64, headers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = req.params;
                dna = params === null || params === void 0 ? void 0 : params.dna;
                unsequenced = (0, dna_1.unsequence)(dna);
                order = [0, 1, 6, 5, 4, 3, 2];
                basePath = path_1.default.join("./", "images/");
                console.log(basePath);
                images = order.map(function (id) {
                    return path_1.default.join(basePath, tables_1.attributeTable[id].name, tables_1.attributeTable[id][unsequenced[id]] + ".png");
                });
                console.log(JSON.stringify(images, null, 2));
                return [4 /*yield*/, mergeImages(images, { Canvas: canvas_1.Canvas, Image: Image })];
            case 1:
                b64 = _a.sent();
                console.log("Unsequenced Attributes: " + JSON.stringify(unsequenced, null, 2) + " - " + b64);
                headers = { "Content-Type": "image/jpg" };
                res.writeHead(200, headers);
                res.end(b64);
                return [2 /*return*/];
        }
    });
}); });
app.get("/", function (req, res) { return res.send("You have reached the Pixsols Generator"); });
app.listen(port, function () {
    console.log("Pixsols Generator listening at on port " + port);
});
function mergeImages(images, arg1) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=index.js.map