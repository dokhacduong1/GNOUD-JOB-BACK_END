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
exports.getPdfToDriver = exports.userViewJob = void 0;
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const userViewJob = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idUser = req.body.idUser;
        const idJob = req.body.idJob;
        if (!idUser) {
            res.status(401).json({
                code: 401,
                error: "Vui lòng nhập id user",
            });
            return;
        }
        if (!idJob) {
            res.status(401).json({
                code: 401,
                error: "Vui lòng nhập id công việc",
            });
            return;
        }
        const user = yield user_model_1.default.findById({ _id: idUser });
        if (!user) {
            res.status(401).json({
                code: 401,
                error: "Truy cập không hợp lệ",
            });
            return;
        }
        const job = yield jobs_model_1.default.findById({ _id: idJob });
        if (!job) {
            res.status(401).json({
                code: 401,
                error: "Truy cập không hợp lệ",
            });
            return;
        }
        const checkUserToJob = yield jobs_model_1.default.findOne({
            _id: idJob,
            "listProfileViewJob.idUser": idUser,
        }).select("_id");
        if (checkUserToJob) {
            res.status(200).json({
                code: 200,
            });
            return;
        }
        next();
    });
};
exports.userViewJob = userViewJob;
const getPdfToDriver = (req, res, next) => {
    try {
        if (!req.body.id_file) {
            res.status(400).json({ error: "File ID Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getPdfToDriver = getPdfToDriver;
