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
exports.createMetadata = exports.processMetaData = exports.decodeMasterEdition = exports.decodeEdition = exports.decodeMetadata = exports.isValidHttpUrl = exports.updateMetadata = void 0;
var web3_js_1 = require("@solana/web3.js");
var borsh_1 = require("borsh");
var types_1 = require("../types");
var borsh_2 = require("./borsh");
var programIds_1 = require("./programIds");
var various_1 = require("./various");
(0, borsh_2.extendBorsh)();
var METADATA_REPLACE = new RegExp("\u0000", "g");
function updateMetadata(data, newUpdateAuthority, primarySaleHappened, mintKey, updateAuthority, instructions, metadataAccount) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, value, txnData, keys;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = metadataAccount;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, various_1.findProgramAddress)([
                            Buffer.from("metadata"),
                            (0, programIds_1.programIds)().metadata.toBuffer(),
                            (0, various_1.toPublicKey)(mintKey).toBuffer(),
                        ], (0, programIds_1.programIds)().metadata)];
                case 1:
                    _a = (_b.sent())[0];
                    _b.label = 2;
                case 2:
                    metadataAccount = _a;
                    value = new types_1.UpdateMetadataArgs({
                        data: data,
                        updateAuthority: !newUpdateAuthority ? undefined : newUpdateAuthority,
                        primarySaleHappened: primarySaleHappened === null || primarySaleHappened === undefined
                            ? null
                            : primarySaleHappened,
                    });
                    txnData = Buffer.from((0, borsh_1.serialize)(types_1.METADATA_SCHEMA, value));
                    keys = [
                        {
                            pubkey: (0, various_1.toPublicKey)(metadataAccount),
                            isSigner: false,
                            isWritable: true,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(updateAuthority),
                            isSigner: true,
                            isWritable: false,
                        },
                    ];
                    instructions.push(new web3_js_1.TransactionInstruction({
                        keys: keys,
                        programId: (0, various_1.toPublicKey)((0, programIds_1.programIds)().metadata),
                        data: txnData,
                    }));
                    return [2 /*return*/, metadataAccount];
            }
        });
    });
}
exports.updateMetadata = updateMetadata;
function isValidHttpUrl(text) {
    if (text.startsWith("http:") || text.startsWith("https:")) {
        return true;
    }
    return false;
}
exports.isValidHttpUrl = isValidHttpUrl;
var decodeMetadata = function (buffer) {
    var metadata = (0, borsh_1.deserializeUnchecked)(types_1.METADATA_SCHEMA, types_1.Metadata, buffer);
    metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
    metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
    metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
    return metadata;
};
exports.decodeMetadata = decodeMetadata;
var decodeEdition = function (buffer) {
    return (0, borsh_1.deserializeUnchecked)(types_1.METADATA_SCHEMA, types_1.Edition, buffer);
};
exports.decodeEdition = decodeEdition;
var decodeMasterEdition = function (buffer) {
    if (buffer[0] == types_1.MetadataKey.MasterEditionV1) {
        return (0, borsh_1.deserializeUnchecked)(types_1.METADATA_SCHEMA, types_1.MasterEditionV1, buffer);
    }
    else {
        return (0, borsh_1.deserializeUnchecked)(types_1.METADATA_SCHEMA, types_1.MasterEditionV2, buffer);
    }
};
exports.decodeMasterEdition = decodeMasterEdition;
var processMetaData = function (_a, setter) {
    var account = _a.account, pubkey = _a.pubkey;
    if (!isMetadataAccount(account))
        return;
    try {
        if (isMetadataV1Account(account)) {
            var metadata = (0, exports.decodeMetadata)(account.data);
            if (isValidHttpUrl(metadata.data.uri)
            // && metadata.data.uri.indexOf('arweave') >= 0
            ) {
                var parsedAccount = {
                    pubkey: pubkey,
                    account: account,
                    info: metadata,
                };
                setter("metadataByMint", metadata.mint, parsedAccount);
            }
        }
        if (isEditionV1Account(account)) {
            var edition = (0, exports.decodeEdition)(account.data);
            var parsedAccount = {
                pubkey: pubkey,
                account: account,
                info: edition,
            };
            setter("editions", pubkey, parsedAccount);
        }
        if (isMasterEditionAccount(account)) {
            var masterEdition = (0, exports.decodeMasterEdition)(account.data);
            if (isMasterEditionV1(masterEdition)) {
                var parsedAccount = {
                    pubkey: pubkey,
                    account: account,
                    info: masterEdition,
                };
                setter("masterEditions", pubkey, parsedAccount);
                setter("masterEditionsByPrintingMint", masterEdition.printingMint, parsedAccount);
                setter("masterEditionsByOneTimeAuthMint", masterEdition.oneTimePrintingAuthorizationMint, parsedAccount);
            }
            else {
                var parsedAccount = {
                    pubkey: pubkey,
                    account: account,
                    info: masterEdition,
                };
                setter("masterEditions", pubkey, parsedAccount);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.processMetaData = processMetaData;
var isMetadataAccount = function (account) {
    return account.owner.equals((0, programIds_1.programIds)().metadata);
};
var isMetadataV1Account = function (account) {
    return account.data[0] === types_1.MetadataKey.MetadataV1;
};
var isEditionV1Account = function (account) {
    return account.data[0] === types_1.MetadataKey.EditionV1;
};
var isMasterEditionAccount = function (account) {
    return account.data[0] === types_1.MetadataKey.MasterEditionV1 ||
        account.data[0] === types_1.MetadataKey.MasterEditionV2;
};
var isMasterEditionV1 = function (me) {
    return me.key === types_1.MetadataKey.MasterEditionV1;
};
function createMetadata(data, updateAuthority, mintKey, mintAuthorityKey, instructions, payer) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataProgramId, metadataAccount, value, txnData, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadataProgramId = (0, programIds_1.programIds)().metadata;
                    return [4 /*yield*/, (0, various_1.findProgramAddress)([
                            Buffer.from("metadata"),
                            (0, various_1.toPublicKey)(metadataProgramId).toBuffer(),
                            (0, various_1.toPublicKey)(mintKey).toBuffer(),
                        ], (0, various_1.toPublicKey)(metadataProgramId))];
                case 1:
                    metadataAccount = (_a.sent())[0];
                    value = new types_1.CreateMetadataArgs({ data: data, isMutable: true });
                    txnData = Buffer.from((0, borsh_1.serialize)(types_1.METADATA_SCHEMA, value));
                    keys = [
                        {
                            pubkey: (0, various_1.toPublicKey)(metadataAccount),
                            isSigner: false,
                            isWritable: true,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(mintKey),
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(mintAuthorityKey),
                            isSigner: true,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(payer),
                            isSigner: true,
                            isWritable: false,
                        },
                        {
                            pubkey: (0, various_1.toPublicKey)(updateAuthority),
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: web3_js_1.SystemProgram.programId,
                            isSigner: false,
                            isWritable: false,
                        },
                        {
                            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                            isSigner: false,
                            isWritable: false,
                        },
                    ];
                    instructions.push(new web3_js_1.TransactionInstruction({
                        keys: keys,
                        programId: (0, various_1.toPublicKey)(metadataProgramId),
                        data: txnData,
                    }));
                    return [2 /*return*/, metadataAccount];
            }
        });
    });
}
exports.createMetadata = createMetadata;
//# sourceMappingURL=metadata.js.map