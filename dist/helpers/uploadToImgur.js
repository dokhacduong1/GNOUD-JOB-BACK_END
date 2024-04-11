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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
dotenv_1.default.config();
const streamUpload = (base64) => __awaiter(void 0, void 0, void 0, function* () {
    const fkey = "1be310e9b025b857f9d1035ea2fd78cf040285e434c4e4e30e4eeeeffc809466";
    const data = new form_data_1.default();
    const buffer = Buffer.from(base64, "base64");
    const fileStream = require("stream").Readable.from(buffer);
    data.append("file", fileStream, { filename: "image.png" });
    data.append("fkey", fkey);
    const config = {
        method: "post",
        url: "https://stackoverflow.com/upload/image",
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    try {
        const response = yield (0, axios_1.default)(config);
        if (response.data.Success) {
            const result = {
                secure_url: response.data.UploadedImage,
            };
            return result;
        }
        return "";
    }
    catch (error) {
        return "";
    }
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
