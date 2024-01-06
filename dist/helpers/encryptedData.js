"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptedData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
function encryptedData(data) {
    var ciphertext = crypto_js_1.default.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return ciphertext;
}
exports.encryptedData = encryptedData;
