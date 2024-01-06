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
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
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
            let queryFeatureValue = false;
            if (req.query.featured) {
                queryFeatureValue = Boolean(req.query.featured);
            }
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
            if (req.query.jobCategoriesKey) {
                const keyword = req.query.jobCategoriesKey;
                const idCategories = yield jobCategories_model_1.default.findOne({
                    slug: keyword
                }).select("id");
                find["job_categorie_id"] = idCategories.id;
            }
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find["status"] = queryStatus;
            }
            if (queryKeyword && (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword)) {
                find["title"] = (0, filterQuerySearch_1.filterQuerySearch)(queryKeyword);
            }
            if (queryFeatureValue) {
                find["featured"] = queryFeatureValue;
            }
            if (req.query.salaryKey && req.query.salaryValue) {
                if (req.query.salaryKey === "gt") {
                    find["salary"] = { $gt: parseInt(req.query.salaryValue.toString()) };
                }
                if (req.query.salaryKey === "lt") {
                    find["salary"] = { $lt: parseInt(req.query.salaryValue.toString()) };
                }
            }
            if (req.query.jobLevel) {
                find["level"] = req.query.jobLevel.toString();
            }
            const countRecord = yield jobs_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue
                };
            }
            const populateCheck = [
                {
                    path: "employerId",
                    select: "image companyName address",
                    model: employers_model_1.default
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default
                },
            ];
            const countJobs = Math.round((countRecord / queryLimit));
            const records = yield jobs_model_1.default.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem || 4)
                .skip(objectPagination.skip || 0)
                .select("").populate(populateCheck);
            const dataEncrypted = (0, encryptedData_1.encryptedData)(records);
            res.status(200).json({ data: dataEncrypted, code: 200, countJobs: countJobs });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.index = index;
