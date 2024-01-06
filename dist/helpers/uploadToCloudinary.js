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
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_2 = require("../config/cloudinary");
cloudinary.config(cloudinary_2.configClound.configCloudinary);
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        try {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            streamifier_1.default.createReadStream(buffer).pipe(stream);
        }
        catch (error) {
            console.log("ok");
        }
    });
};
const uploadSingle = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield streamUpload(buffer);
        return result["secure_url"];
    }
    catch (error) {
        console.log("ok");
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
