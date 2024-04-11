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
exports.uploadMultiple = exports.uploadSingleFile = exports.uploadSingle = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const stream_1 = __importDefault(require("stream"));
dotenv_1.default.config();
const CLIENT_ID = process.env.CLIENT_DRIVER_ID;
const CLIENT_SECRET = process.env.CLIENT_DRIVER_SECRET;
const REDIRECT_URI = process.env.REDIRECT_DRIVER_URI;
const REFRESH_TOKEN = process.env.REFRESH_DRIVER_TOKEN2;
const streamUpload = (base64) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const binaryData = Buffer.from(base64, "base64");
        const oauth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const drive = googleapis_1.google.drive({
            version: "v3",
            auth: oauth2Client,
        });
        const readableStream = new stream_1.default.PassThrough();
        readableStream.end(binaryData);
        const upload = yield drive.files.create({
            requestBody: {
                name: "duong-image" + Date.now().toString() + ".png",
                mimeType: "image/png",
            },
            media: {
                mimeType: "image/png",
                body: readableStream,
            },
        });
        yield drive.permissions.create({
            fileId: upload.data["id"],
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });
        upload["secure_url"] = `https://lh3.googleusercontent.com/d/${upload.data["id"]}`;
        return upload;
    }
    catch (error) {
        console.log(error);
    }
});
const streamUploadPdf = (base64) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const binaryData = Buffer.from(base64, "base64");
        const oauth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const drive = googleapis_1.google.drive({
            version: "v3",
            auth: oauth2Client,
        });
        const readableStream = new stream_1.default.PassThrough();
        readableStream.end(binaryData);
        const upload = yield drive.files.create({
            requestBody: {
                name: "CV-GNOUD-" + Date.now().toString() + ".pdf",
                mimeType: "application/pdf",
                parents: ["1-wrUehzAAPZBVeJoWGu0CZ0Skyz8nU_m"],
            },
            media: {
                mimeType: "application/pdf",
                body: readableStream,
            },
        });
        yield drive.permissions.create({
            fileId: upload.data["id"],
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });
        upload["id_file"] = upload.data["id"];
        return upload;
    }
    catch (error) {
        console.log(error);
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
const uploadSingleFile = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield streamUploadPdf(buffer);
        return result["id_file"];
    }
    catch (error) {
        console.log(error);
    }
});
exports.uploadSingleFile = uploadSingleFile;
const uploadMultiple = (arrayBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    for (let buffer of arrayBuffer) {
        const link = yield streamUpload(buffer);
        result.push(link["secure_url"]);
    }
    return result;
});
exports.uploadMultiple = uploadMultiple;
