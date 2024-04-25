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
exports.getCompany = exports.coutJobs = exports.index = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
            };
            let queryStatus = "";
            let querySortKey = "";
            let querySortValue = "";
            let queryPage = 1;
            let queryLimit = 6;
            let queryKeyword = "";
            if (req.query.status) {
                queryStatus = req.query.status.toString() || "";
            }
            if (req.query.sortKey) {
                querySortKey = req.query.sortKey.toString() || "title";
            }
            if (req.query.sortValue) {
                querySortValue = req.query.sortValue.toString() || "asc";
            }
            if (req.query.page) {
                queryPage = parseInt(req.query.page.toString());
            }
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit.toString());
            }
            if (req.query.keyword) {
                queryKeyword = req.query.keyword.toString() || "";
            }
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find.status = queryStatus;
            }
            if (queryKeyword && (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword)) {
                find.companyName = (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword);
            }
            const countRecord = yield employers_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue,
                };
            }
            const records = yield employers_model_1.default.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem || 4)
                .skip(objectPagination.skip || 0)
                .select("-password -phoneNumber -listApprovedUsers -email -token");
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
const coutJobs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
                status: "active",
            };
            const records = yield employers_model_1.default.find(find)
                .select("companyName image logoCompany slug")
                .sort({ companyName: 1 });
            const convertDataPromises = records.map((record) => __awaiter(this, void 0, void 0, function* () {
                const countJob = yield jobs_model_1.default.countDocuments({ employerId: record._id });
                return Object.assign(Object.assign({}, record.toObject()), { ["countJobs"]: countJob });
            }));
            const convertData = yield Promise.all(convertDataPromises);
            const dataEncrypted = (0, encryptedData_1.encryptedData)(convertData);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.coutJobs = coutJobs;
const getCompany = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const find = {
                deleted: false,
                slug,
            };
            const record = yield employers_model_1.default.findOne(find).select("-password -phoneNumber -listApprovedUsers -email -token ").lean();
            if (!record) {
                res.status(200).json({ data: [], code: 200, employersWithJobCounts: [] });
                return;
            }
            const activityFieldList = (_a = record === null || record === void 0 ? void 0 : record.activityFieldList) !== null && _a !== void 0 ? _a : [];
            const findEmployersInIndustry = yield employers_model_1.default.find({
                activityFieldList: { $in: activityFieldList },
                _id: { $ne: record === null || record === void 0 ? void 0 : record._id },
            })
                .select("companyName image logoCompany slug")
                .sort({ companyName: 1 })
                .limit(6)
                .lean();
            const countJobsPromises = findEmployersInIndustry.map((item) => __awaiter(this, void 0, void 0, function* () {
                const countJob = yield jobs_model_1.default.countDocuments({ employerId: item._id });
                return Object.assign(Object.assign({}, item), { countJobs: countJob });
            }));
            const employersWithJobCounts = yield Promise.all(countJobsPromises);
            const encryptedDataConvert = (0, encryptedData_1.encryptedData)(record);
            res
                .status(200)
                .json({ data: encryptedDataConvert, code: 200, employersWithJobCounts });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCompany = getCompany;
