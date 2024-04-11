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
exports.getPdfToDriver = exports.userViewJob = exports.mayBeInterested = exports.advancedSearch = exports.jobSearchPosition = exports.jobsByCategories = exports.jobSearch = exports.index = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuerySearch_1 = require("../../../../helpers/filterQuerySearch");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
const searchPro_1 = require("../../../../helpers/searchPro");
const getFileToDriver_1 = require("../../../../helpers/getFileToDriver");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
                status: "active",
            };
            let queryStatus = "";
            let querySortKey = "";
            let querySortValue = "";
            let queryPage = 1;
            let queryLimit = 6;
            let queryKeyword = "";
            let queryFeatureValue = false;
            let selectItem = "";
            if (req.query.selectItem) {
                selectItem = req.query.selectItem.toString();
            }
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
                    slug: keyword,
                }).select("id");
                if (idCategories) {
                    find["job_categorie_id"] = idCategories.id;
                }
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
                    find["salaryMax"] = { $gt: parseInt(req.query.salaryValue.toString()) };
                }
                if (req.query.salaryKey === "lt") {
                    find["salaryMax"] = { $lt: parseInt(req.query.salaryValue.toString()) };
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
                    [querySortKey]: querySortValue,
                };
            }
            const populateCheck = [
                {
                    path: "employerId",
                    select: "image companyName address logoCompany",
                    model: employers_model_1.default,
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default,
                },
            ];
            const countJobs = Math.round(countRecord / queryLimit);
            const records = yield jobs_model_1.default.find(find)
                .sort(sort)
                .limit(objectPagination.limitItem || 4)
                .skip(objectPagination.skip || 0)
                .select(selectItem)
                .populate(populateCheck);
            const convertData = records.map((record) => (Object.assign(Object.assign({}, record.toObject()), { companyName: record["employerId"]["companyName"], companyImage: record["employerId"]["image"], logoCompany: record["employerId"]["logoCompany"] })));
            const dataEncrypted = (0, encryptedData_1.encryptedData)(convertData);
            res
                .status(200)
                .json({ data: dataEncrypted, code: 200, countJobs: countJobs });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.index = index;
const jobSearch = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const slug = req.params.slug;
        try {
            const find = {
                deleted: false,
                slug: slug,
                status: "active",
            };
            const populateCheck = [
                {
                    path: "employerId",
                    select: "image companyName address",
                    model: employers_model_1.default,
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default,
                },
            ];
            const records = yield jobs_model_1.default.findOne(find).populate(populateCheck);
            const convertData = Object.assign(Object.assign({}, records.toObject()), { companyName: records["employerId"]["companyName"], companyImage: records["employerId"]["image"], job_categories_title: records["job_categorie_id"].map((item) => item.title) });
            const jobCategoriesId = records["job_categorie_id"].map((item) => item._id.toString());
            const recordJobCategories = yield jobs_model_1.default.find({
                job_categorie_id: { $in: jobCategoriesId },
                _id: { $ne: records._id },
                deleted: false,
                status: "active",
            })
                .populate(populateCheck)
                .select("address slug title salaryMin salaryMax");
            convertData["jobByCategories"] = recordJobCategories;
            const dataEncrypted = (0, encryptedData_1.encryptedData)(convertData);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error", code: 500 });
        }
    });
};
exports.jobSearch = jobSearch;
const jobsByCategories = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).json({ data: "ok", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.jobsByCategories = jobsByCategories;
const jobSearchPosition = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyword = ((_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            if (keyword === "") {
                res.status(200).json({ data: [], code: 200 });
                return;
            }
            const unidecodeSlug = (0, convertToSlug_1.convertToSlug)(keyword);
            const find = {
                deleted: false,
                status: "active",
                $or: [
                    { listTagName: { $regex: new RegExp(keyword, "i") } },
                    { listTagSlug: { $regex: new RegExp(unidecodeSlug, "i") } },
                ],
            };
            const jobSearch = yield jobs_model_1.default.find(find, {
                listTagName: 1,
                listTagSlug: 1,
            }).limit(10);
            const convertArrr = (0, searchPro_1.searchPro)(jobSearch, unidecodeSlug, "listTagName", "listTagSlug");
            res.status(200).json({ data: convertArrr, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.jobSearchPosition = jobSearchPosition;
const advancedSearch = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
                status: "active",
                end_date: { $gte: new Date() },
            };
            let querySortKey = "title";
            let querySortValue = "asc";
            let queryPage = 1;
            let queryLimit = 20;
            let select = "-email -createdBy ";
            if (req.query.sort_key) {
                querySortKey = req.query.sort_key.toString() || "title";
            }
            if (req.query.sort_value) {
                querySortValue = req.query.sort_value.toString() || "asc";
            }
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue,
                };
            }
            if (req.query.page) {
                queryPage = parseInt(req.query.page.toString());
            }
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit.toString());
            }
            if (req.query.keyword) {
                const keyword = req.query.keyword.toString();
                const keywordRegex = new RegExp(keyword, "i");
                const unidecodeSlug = (0, convertToSlug_1.convertToSlug)(keyword);
                const slugRegex = new RegExp(unidecodeSlug, "i");
                find["$or"] = [{ title: keywordRegex }, { keyword: slugRegex }];
            }
            if (req.query.job_categories) {
                find["job_categorie_id"] = req.query.job_categories.toString();
            }
            if (req.query.job_type) {
                find["jobType"] = req.query.job_type.toString();
            }
            if (req.query.job_level) {
                find["level"] = req.query.job_level.toString();
            }
            if (req.query.salary_min && req.query.salary_max) {
                find["salaryMax"] = {
                    $gte: parseInt(req.query.salary_min.toString()),
                    $lte: parseInt(req.query.salary_max.toString()),
                };
            }
            if (req.query.select) {
                select = req.query.select.toString();
            }
            const populateCheck = [
                {
                    path: "employerId",
                    select: "image companyName address logoCompany",
                    model: employers_model_1.default,
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default,
                },
            ];
            const countRecord = yield jobs_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            const countJobs = Math.round(countRecord / queryLimit);
            const records = yield jobs_model_1.default.find(find)
                .populate(populateCheck)
                .sort(sort)
                .limit(objectPagination.limitItem)
                .skip(objectPagination.skip)
                .select(select);
            const convertData = records.map((record) => (Object.assign(Object.assign({}, record.toObject()), { companyName: record["employerId"]["companyName"], companyImage: record["employerId"]["image"], logoCompany: record["employerId"]["logoCompany"] })));
            const dataEncrypted = (0, encryptedData_1.encryptedData)(convertData);
            res
                .status(200)
                .json({ data: dataEncrypted, code: 200, countJobs: countJobs });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.advancedSearch = advancedSearch;
const mayBeInterested = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobCategoriesId = req.body.jobCategoriesId;
            const populateCheck = [
                {
                    path: "employerId",
                    select: "image companyName address logoCompany",
                    model: employers_model_1.default,
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default,
                },
            ];
            let job = yield jobs_model_1.default.find({
                job_categorie_id: jobCategoriesId,
                deleted: false,
                status: "active",
                salaryMax: { $gte: 0 },
            })
                .sort({ salaryMax: -1 })
                .limit(1)
                .populate(populateCheck)
                .select("-email -deleted -status -phone")
                .then((jobs) => jobs[0]);
            if (!job) {
                const count = yield jobs_model_1.default.countDocuments({
                    deleted: false,
                    status: "active",
                    salaryMax: { $gte: 0 },
                });
                if (count === 0) {
                    res.status(200).json({ data: [], code: 200 });
                    return;
                }
                const random = Math.floor(Math.random() * count);
                job = yield jobs_model_1.default.findOne({
                    deleted: false,
                    status: "active",
                    salaryMax: { $gte: 0 },
                })
                    .skip(random)
                    .populate(populateCheck)
                    .select("-email -deleted -status -phone");
            }
            const convertData = Object.assign(Object.assign({}, job.toObject()), { companyName: job["employerId"]["companyName"], companyImage: job["employerId"]["image"], logoCompany: job["employerId"]["logoCompany"] });
            res.status(200).json({ data: convertData, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.mayBeInterested = mayBeInterested;
const userViewJob = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idUser = req.body.idUser;
            const idJob = req.body.idJob;
            const objectNew = {
                idUser: idUser,
                dataTime: new Date(),
                buy: false,
                follow: false,
            };
            yield jobs_model_1.default.updateOne({
                _id: idJob,
            }, {
                $push: {
                    listProfileViewJob: objectNew,
                },
            });
            res.status(200).json({ data: "ok", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.userViewJob = userViewJob;
const getPdfToDriver = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_file = req.body.id_file;
            const base64 = yield (0, getFileToDriver_1.getFileDriverToBase64)(id_file);
            res.status(200).json({ code: 200, data: base64 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getPdfToDriver = getPdfToDriver;
