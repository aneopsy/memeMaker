"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendBorsh = exports.METADATA_SCHEMA = exports.CreateMasterEditionArgs = exports.CreateMetadataArgs = exports.Data = exports.Creator = void 0;
var borsh_1 = require("borsh");
var bs58_1 = __importDefault(require("bs58"));
var web3_js_1 = require("@solana/web3.js");
var Creator = /** @class */ (function () {
    function Creator(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
    return Creator;
}());
exports.Creator = Creator;
var Data = /** @class */ (function () {
    function Data(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
    return Data;
}());
exports.Data = Data;
var CreateMetadataArgs = /** @class */ (function () {
    function CreateMetadataArgs(args) {
        this.instruction = 0;
        this.data = args.data;
        this.isMutable = args.isMutable;
    }
    return CreateMetadataArgs;
}());
exports.CreateMetadataArgs = CreateMetadataArgs;
var CreateMasterEditionArgs = /** @class */ (function () {
    function CreateMasterEditionArgs(args) {
        this.instruction = 10;
        this.maxSupply = args.maxSupply;
    }
    return CreateMasterEditionArgs;
}());
exports.CreateMasterEditionArgs = CreateMasterEditionArgs;
exports.METADATA_SCHEMA = new Map([
    [
        CreateMetadataArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["data", Data],
                ["isMutable", "u8"], // bool
            ],
        },
    ],
    [
        CreateMasterEditionArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["maxSupply", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        Data,
        {
            kind: "struct",
            fields: [
                ["name", "string"],
                ["symbol", "string"],
                ["uri", "string"],
                ["sellerFeeBasisPoints", "u16"],
                ["creators", { kind: "option", type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: "struct",
            fields: [
                ["address", "pubkeyAsString"],
                ["verified", "u8"],
                ["share", "u8"],
            ],
        },
    ],
]);
var extendBorsh = function () {
    borsh_1.BinaryReader.prototype.readPubkey = function () {
        var reader = this;
        var array = reader.readFixedArray(32);
        return new web3_js_1.PublicKey(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
        var writer = this;
        writer.writeFixedArray(value.toBuffer());
    };
    borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
        var reader = this;
        var array = reader.readFixedArray(32);
        return bs58_1.default.encode(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
        var writer = this;
        writer.writeFixedArray(bs58_1.default.decode(value));
    };
};
exports.extendBorsh = extendBorsh;
(0, exports.extendBorsh)();
//# sourceMappingURL=schema.js.map