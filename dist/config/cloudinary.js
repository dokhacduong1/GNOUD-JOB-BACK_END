"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configClound = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONFIG = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
};
exports.configClound = {
    configCloudinary: CONFIG
};
