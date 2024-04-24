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
exports.getCvInfoUser = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const getCvInfoUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data;
            if (req["infoRoom"]) {
                data = {
                    fullName: req["infoRoom"].title,
                    logoCompany: req["infoRoom"].avatar,
                    statusOnline: true,
                };
            }
            else {
                const idUser = req.params.idUser;
                data = yield employers_model_1.default.findOne({ _id: idUser }).select("email phone fullName image statusOnline");
                data["logoCompany"] = data["image"];
            }
            res.status(200).json({ data: data, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCvInfoUser = getCvInfoUser;
