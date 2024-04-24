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
exports.getCvInfoUser = exports.getCvApplyAccept = exports.getCvApply = void 0;
const cvs_model_1 = __importDefault(require("../../../../models/cvs.model"));
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const getCvApply = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employerId = req["user"]._id;
            const find = {
                employerId: employerId,
            };
            if (req.query.status) {
                find.status = req.query.status.toString();
            }
            if (req.query.keyword) {
                const keyword = req.query.keyword.toString();
                const keywordRegex = new RegExp(keyword, "i");
                const users = yield user_model_1.default.find({ fullName: keywordRegex }).select("_id");
                const userIds = users.map((user) => user._id);
                const jobs = yield jobs_model_1.default.find({ title: keywordRegex }).select("_id");
                const jobIds = jobs.map((job) => job._id);
                find["$or"] = [
                    { email: keywordRegex },
                    { phone: keywordRegex },
                    { idUser: userIds },
                    { idJob: jobIds },
                ];
            }
            const populate = [
                {
                    path: "idJob",
                    select: "title",
                    model: jobs_model_1.default,
                },
                {
                    path: "idUser",
                    select: "email phone fullName avatar",
                    model: user_model_1.default,
                },
            ];
            const record = yield cvs_model_1.default.find(find).populate(populate);
            res.status(200).json({ data: record, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCvApply = getCvApply;
const getCvApplyAccept = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employerId = req["user"]._id;
            const find = {
                employerId: employerId,
                status: "accept",
            };
            const populate = [
                {
                    path: "idJob",
                    select: "title",
                    model: jobs_model_1.default,
                },
                {
                    path: "idUser",
                    select: "email phone fullName avatar",
                    model: user_model_1.default,
                },
            ];
            const record = yield cvs_model_1.default.find(find)
                .populate(populate)
                .select("idUser")
                .sort({ createdAt: -1 })
                .limit(7);
            const convertRecord = record.map((item) => item.idUser);
            res.status(200).json({ data: convertRecord, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCvApplyAccept = getCvApplyAccept;
const getCvInfoUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data;
            if (req["infoRoom"]) {
                data = {
                    fullName: req["infoRoom"].title,
                    avatar: req["infoRoom"].avatar,
                    statusOnline: true,
                };
            }
            else {
                const idUser = req.params.idUser;
                data = yield user_model_1.default.findOne({ _id: idUser }).select("email phone fullName avatar statusOnline");
            }
            res.status(200).json({ data, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCvInfoUser = getCvInfoUser;
