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
exports.index = void 0;
const skills_model_1 = __importDefault(require("../../../../models/skills.model"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {};
            if (req.query.title) {
                find.title = req.query.title.toString();
            }
            const records = yield skills_model_1.default.find(find);
            const dataEncrypted = (0, encryptedData_1.encryptedData)(records);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.index = index;
