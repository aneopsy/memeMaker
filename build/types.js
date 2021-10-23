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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtType = exports.METADATA_SCHEMA = exports.EDITION_MARKER_BIT_SIZE = exports.MintPrintingTokensArgs = exports.CreateMasterEditionArgs = exports.UpdateMetadataArgs = exports.CreateMetadataArgs = exports.Metadata = exports.Data = exports.Creator = exports.Edition = exports.linkStatus = exports.ConfigData = exports.EditionMarker = exports.MasterEditionV2 = exports.MasterEditionV1 = exports.MetadataCategory = exports.MetadataKey = exports.getEdition = exports.LinkStatus = void 0;
var constants_1 = require("./helpers/constants");
var programIds_1 = require("./helpers/programIds");
var various_1 = require("./helpers/various");
var LinkStatus;
(function (LinkStatus) {
    LinkStatus[LinkStatus["Unchecked"] = 0] = "Unchecked";
    LinkStatus[LinkStatus["Checked"] = 1] = "Checked";
    LinkStatus[LinkStatus["Down"] = 2] = "Down";
})(LinkStatus = exports.LinkStatus || (exports.LinkStatus = {}));
function getEdition(tokenMint) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, various_1.findProgramAddress)([
                        Buffer.from(constants_1.METADATA_PREFIX),
                        (0, programIds_1.programIds)().metadata.toBuffer(),
                        (0, various_1.toPublicKey)(tokenMint).toBuffer(),
                        Buffer.from(constants_1.EDITION),
                    ], (0, programIds_1.programIds)().metadata)];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
}
exports.getEdition = getEdition;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var MetadataCategory;
(function (MetadataCategory) {
    MetadataCategory["Audio"] = "audio";
    MetadataCategory["Video"] = "video";
    MetadataCategory["Image"] = "image";
    MetadataCategory["VR"] = "vr";
})(MetadataCategory = exports.MetadataCategory || (exports.MetadataCategory = {}));
var MasterEditionV1 = /** @class */ (function () {
    function MasterEditionV1(args) {
        this.key = MetadataKey.MasterEditionV1;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
        this.printingMint = args.printingMint;
        this.oneTimePrintingAuthorizationMint =
            args.oneTimePrintingAuthorizationMint;
    }
    return MasterEditionV1;
}());
exports.MasterEditionV1 = MasterEditionV1;
var MasterEditionV2 = /** @class */ (function () {
    function MasterEditionV2(args) {
        this.key = MetadataKey.MasterEditionV2;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
    }
    return MasterEditionV2;
}());
exports.MasterEditionV2 = MasterEditionV2;
var EditionMarker = /** @class */ (function () {
    function EditionMarker(args) {
        this.key = MetadataKey.EditionMarker;
        this.ledger = args.ledger;
    }
    EditionMarker.prototype.editionTaken = function (edition) {
        var editionOffset = edition % exports.EDITION_MARKER_BIT_SIZE;
        var indexOffset = Math.floor(editionOffset / 8);
        if (indexOffset > 30) {
            throw Error("bad index for edition");
        }
        var positionInBitsetFromRight = 7 - (editionOffset % 8);
        var mask = Math.pow(2, positionInBitsetFromRight);
        var appliedMask = this.ledger[indexOffset] & mask;
        return appliedMask != 0;
    };
    return EditionMarker;
}());
exports.EditionMarker = EditionMarker;
var ConfigData = /** @class */ (function () {
    function ConfigData(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
        this.maxNumberOfLines = args.maxNumberOfLines;
        this.isMutable = args.isMutable;
        this.maxSupply = args.maxSupply;
        this.retainAuthority = args.retainAuthority;
    }
    return ConfigData;
}());
exports.ConfigData = ConfigData;
var linkStatus;
(function (linkStatus) {
})(linkStatus = exports.linkStatus || (exports.linkStatus = {}));
var Edition = /** @class */ (function () {
    function Edition(args) {
        this.key = MetadataKey.EditionV1;
        this.parent = args.parent;
        this.edition = args.edition;
    }
    return Edition;
}());
exports.Edition = Edition;
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
var Metadata = /** @class */ (function () {
    function Metadata(args) {
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = args.editionNonce;
    }
    Metadata.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var edition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getEdition(this.mint)];
                    case 1:
                        edition = _a.sent();
                        this.edition = edition;
                        this.masterEdition = edition;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Metadata;
}());
exports.Metadata = Metadata;
var CreateMetadataArgs = /** @class */ (function () {
    function CreateMetadataArgs(args) {
        this.instruction = 0;
        this.data = args.data;
        this.isMutable = args.isMutable;
    }
    return CreateMetadataArgs;
}());
exports.CreateMetadataArgs = CreateMetadataArgs;
var UpdateMetadataArgs = /** @class */ (function () {
    function UpdateMetadataArgs(args) {
        this.instruction = 1;
        this.data = args.data ? args.data : null;
        this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
        this.primarySaleHappened = args.primarySaleHappened;
    }
    return UpdateMetadataArgs;
}());
exports.UpdateMetadataArgs = UpdateMetadataArgs;
var CreateMasterEditionArgs = /** @class */ (function () {
    function CreateMasterEditionArgs(args) {
        this.instruction = 10;
        this.maxSupply = args.maxSupply;
    }
    return CreateMasterEditionArgs;
}());
exports.CreateMasterEditionArgs = CreateMasterEditionArgs;
var MintPrintingTokensArgs = /** @class */ (function () {
    function MintPrintingTokensArgs(args) {
        this.instruction = 9;
        this.supply = args.supply;
    }
    return MintPrintingTokensArgs;
}());
exports.MintPrintingTokensArgs = MintPrintingTokensArgs;
exports.EDITION_MARKER_BIT_SIZE = 248;
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
        UpdateMetadataArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["data", { kind: "option", type: Data }],
                ["updateAuthority", { kind: "option", type: "pubkeyAsString" }],
                ["primarySaleHappened", { kind: "option", type: "u8" }],
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
        MintPrintingTokensArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["supply", "u64"],
            ],
        },
    ],
    [
        MasterEditionV1,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
                ["printingMint", "pubkeyAsString"],
                ["oneTimePrintingAuthorizationMint", "pubkeyAsString"],
            ],
        },
    ],
    [
        MasterEditionV2,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        Edition,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["parent", "pubkeyAsString"],
                ["edition", "u64"],
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
    [
        Metadata,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["updateAuthority", "pubkeyAsString"],
                ["mint", "pubkeyAsString"],
                ["data", Data],
                ["primarySaleHappened", "u8"],
                ["isMutable", "u8"], // bool
            ],
        },
    ],
    [
        EditionMarker,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["ledger", [31]],
            ],
        },
    ],
]);
var ArtType;
(function (ArtType) {
    ArtType[ArtType["Master"] = 0] = "Master";
    ArtType[ArtType["Print"] = 1] = "Print";
    ArtType[ArtType["NFT"] = 2] = "NFT";
})(ArtType = exports.ArtType || (exports.ArtType = {}));
//# sourceMappingURL=types.js.map