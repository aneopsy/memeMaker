"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigSlice = exports.getRank = void 0;
var constants_1 = require("./constants");
var various_1 = require("./various");
var getRank = function (nft) {
    var _a;
    if ((_a = nft.metadata) === null || _a === void 0 ? void 0 : _a.attributes) {
        var rank = nft.metadata.attributes.find(function (attr) { return String(attr.trait_type).toLowerCase() === "rank"; });
        if (rank)
            return parseInt(rank.value);
    }
    return nft === null || nft === void 0 ? void 0 : nft.rank;
};
exports.getRank = getRank;
var getConfigSlice = function (data, index) {
    var slice = data.slice(constants_1.CONFIG_ARRAY_START + 4 + constants_1.CONFIG_LINE_SIZE * index, constants_1.CONFIG_ARRAY_START + 4 + constants_1.CONFIG_LINE_SIZE * (index + 1));
    return {
        id: index,
        name: (0, various_1.fromUTF8Array)(__spreadArray([], __read(slice.slice(4, 36)), false), true),
        uri: (0, various_1.fromUTF8Array)(__spreadArray([], __read(slice.slice(40, 240)), false), true),
    };
};
exports.getConfigSlice = getConfigSlice;
//# sourceMappingURL=hackUtils.js.map