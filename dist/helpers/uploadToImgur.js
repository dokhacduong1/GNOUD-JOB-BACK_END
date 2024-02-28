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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const imgur_1 = __importDefault(require("imgur"));
dotenv_1.default.config();
const streamUpload = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    imgur_1.default.setClientId(process.env.IMGUR_CLIENT_ID);
    const upload = yield imgur_1.default.uploadBase64(buffer);
    upload["secure_url"] = upload.link;
    return upload;
});
const uploadSingle = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield streamUpload(buffer);
        return result["secure_url"];
    }
    catch (error) {
        console.log(error);
    }
});
exports.uploadSingle = uploadSingle;
const uploadMultiple = (arrayBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    for (let buffer of arrayBuffer) {
        const link = yield streamUpload(buffer);
        result.push(link["secure_url"]);
    }
    return result;
});
exports.uploadMultiple = uploadMultiple;
