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
exports.replaceAttr = exports.sequence = exports.unsequence = exports.buf2bin = exports.buf2hex = exports.hex2buff = void 0;
var tables_1 = require("./tables");
function hex2buff(hexString) {
    hexString = hexString.replace(/^0x/, "");
    if (hexString.length % 2 != 0) {
        console.log("WARNING: expecting an even number of characters in the hexString");
    }
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log("WARNING: found non-hex characters", bad);
    }
    var pairs = hexString.match(/[\dA-F]{4}/gi);
    var integers = pairs.map(function (s) {
        return parseInt(s, 16);
    });
    var array = new Uint16Array(integers);
    return array;
}
exports.hex2buff = hex2buff;
function buf2hex(buffer) {
    return __spreadArray([], __read(new Uint16Array(buffer)), false).map(function (x) { return x.toString(16).padStart(4, "0"); })
        .join("");
}
exports.buf2hex = buf2hex;
function buf2bin(buffer) {
    return __spreadArray([], __read(new Uint16Array(buffer)), false).map(function (x) { return x.toString(2).padStart(16, "0"); })
        .join("");
}
exports.buf2bin = buf2bin;
var unsequence = function (sequence) {
    return hex2buff(sequence).reduce(function (acc, id, index) {
        acc.push({
            trait_type: Object.values(tables_1.attributeTable)[index].name,
            value: Object.values(tables_1.attributeTable)[index].items.find(function (attr) { return attr.id === id; }).name,
        });
        return acc;
    }, []);
};
exports.unsequence = unsequence;
var sequence = function (object) {
    return buf2hex(object.reduce(function (acc, id) {
        if (tables_1.attributeTable.find(function (attr) { return attr.name === id.trait_type; }))
            acc.push(tables_1.attributeTable
                .find(function (attr) { return attr.name === id.trait_type; })
                .items.find(function (trait) { return trait.name === id.value; }).id);
        return acc;
    }, []));
};
exports.sequence = sequence;
var replaceAttr = function (attrs, attr) {
    return attrs.reduce(function (acc, val) {
        if (val.trait_type === attr.trait_type)
            acc.push(attr);
        else
            acc.push(val);
        return acc;
    }, []);
};
exports.replaceAttr = replaceAttr;
//# sourceMappingURL=dna.js.map