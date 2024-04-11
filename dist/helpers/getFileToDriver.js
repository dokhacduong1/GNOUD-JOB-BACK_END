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
exports.getFileDriverToBase64 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const CLIENT_ID = process.env.CLIENT_DRIVER_ID;
const CLIENT_SECRET = process.env.CLIENT_DRIVER_SECRET;
const REDIRECT_URI = process.env.REDIRECT_DRIVER_URI;
const REFRESH_TOKEN = process.env.REFRESH_DRIVER_TOKEN2;
const getFileDriverToBase64 = (fileId = "", alt = "media") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const drive = googleapis_1.google.drive({
            version: "v3",
            auth: oauth2Client,
        });
        const response = yield drive.files.get({
            fileId: fileId,
            alt: alt,
        }, { responseType: 'stream' });
        const base64 = yield readableStreamToString(response.data);
        return base64;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getFileDriverToBase64 = getFileDriverToBase64;
const readableStreamToString = (readableStream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data);
        });
        readableStream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer.toString('base64'));
        });
        readableStream.on('error', reject);
    });
};
