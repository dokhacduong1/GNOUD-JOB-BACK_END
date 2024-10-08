"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uplloadReactPdf = exports.uplloadTiny = exports.uplloadReact = void 0;
const uploadToDriver = __importStar(require("../../../../helpers/uploadToDriver"));
const uplloadReact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body["thumbUrl"]) {
        try {
            const buffer = req.body.thumbUrl;
            const link = yield uploadToDriver.uploadSingle(buffer);
            req.body["thumbUrl"] = link;
        }
        catch (error) {
            console.error("ok");
        }
    }
    next();
});
exports.uplloadReact = uplloadReact;
const uplloadTiny = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req["file"]) {
        try {
            const link = yield uploadToDriver.uploadSingle(req["file"].buffer);
            req.body[req["file"].fieldname] = link;
        }
        catch (error) {
            console.error(error);
        }
    }
    next();
});
exports.uplloadTiny = uplloadTiny;
const uplloadReactPdf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body["file"]) {
        try {
            const buffer = req.body["file"];
            const link = yield uploadToDriver.uploadSingleFile(buffer);
            req.body["file"] = link;
        }
        catch (error) {
            console.error("ok");
        }
    }
    next();
});
exports.uplloadReactPdf = uplloadReactPdf;
