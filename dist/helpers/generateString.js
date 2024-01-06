"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomString = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomString = (length) => {
    const seed = new Date().getTime();
    const conver = Math.random() + seed;
    const token = crypto_1.default.randomBytes(length).toString('hex') + conver;
    return token;
};
exports.generateRandomString = generateRandomString;
const generateRandomNumber = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
};
exports.generateRandomNumber = generateRandomNumber;
