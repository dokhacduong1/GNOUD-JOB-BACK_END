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
exports.changeMulti = exports.edit = exports.changeStatus = exports.deleteJobs = exports.create = exports.index = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const slug_1 = __importDefault(require("slug"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-view")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
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
                const keyword = req.query.keyword.toString();
                const keywordRegex = new RegExp(keyword, "i");
                const unidecodeSlug = (0, convertToSlug_1.convertToSlug)(keyword);
                const slugRegex = new RegExp(unidecodeSlug, "i");
                find["$or"] = [{ title: keywordRegex }, { keyword: slugRegex }];
            }
            if (req.query.jobCategoriesKey) {
                const keyword = req.query.jobCategoriesKey;
                const idCategories = yield jobCategories_model_1.default.findOne({
                    slug: keyword,
                }).select("id");
                find["job_categorie_id"] = idCategories.id;
            }
            if (queryStatus && (0, filterQueryStatus_1.filterQueryStatus)(queryStatus)) {
                find["status"] = queryStatus;
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
                    [querySortKey]: querySortValue,
                };
            }
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
            const countJobs = Math.round(countRecord / queryLimit);
            let records = [];
            if (req.query.findAll) {
                records = yield jobs_model_1.default.find(find)
                    .sort(sort)
                    .select("")
                    .populate(populateCheck);
            }
            else {
                records = yield jobs_model_1.default.find(find)
                    .sort(sort)
                    .limit(objectPagination.limitItem || 4)
                    .skip(objectPagination.skip || 0)
                    .select("")
                    .populate(populateCheck);
            }
            const convertData = records.map((record) => (Object.assign(Object.assign({}, record.toObject()), { companyName: record["employerId"]["companyName"], companyImage: record["employerId"]["image"] })));
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
const create = function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-create")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            let listSlugTag = [];
            if (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.listTagName) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                listSlugTag = req.body.listTagName.map((item) => `${(0, slug_1.default)(item)}-${Date.now()}`);
            }
            const Jobs = {
                title: req.body.title,
                description: req.body.description || "",
                employerId: req.body.employerId,
                job_categorie_id: req.body.job_categorie_id,
                website: req.body.website || "",
                level: req.body.level,
                jobType: req.body.jobType,
                salaryMin: req.body.salaryMin,
                salaryMax: req.body.salaryMax,
                ageMin: req.body.ageMin || 0,
                ageMax: req.body.ageMax || 0,
                gender: req.body.gender,
                educationalLevel: req.body.educationalLevel,
                workExperience: req.body.workExperience,
                presentationLanguage: req.body.presentationLanguage,
                status: req.body.status,
                detailWorkExperience: req.body.detailWorkExperience || "",
                linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
                welfare: req.body.welfare,
                phone: req.body.phone,
                email: req.body.email,
                featured: req.body.featured,
                end_date: req.body.end_date,
                listTagName: req.body.listTagName || [],
                listTagSlug: listSlugTag || [],
                receiveEmail: req.body.receiveEmail,
                address: {
                    location: req.body.address,
                    linkMap: req.body.location || "",
                },
                city: req.body.city,
            };
            const record = new jobs_model_1.default(Jobs);
            yield record.save();
            res
                .status(201)
                .json({ success: "Tạo Công Việc Thành Công!", code: 201 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.create = create;
const deleteJobs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-delete")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            yield jobs_model_1.default.updateOne({ _id: id }, {
                deleted: true,
                deletedAt: new Date(),
            });
            res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.deleteJobs = deleteJobs;
const changeStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-edit")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            const id = req.params.id.toString();
            const status = req.body.status.toString();
            yield jobs_model_1.default.updateOne({
                _id: id,
            }, {
                status: status,
            });
            res
                .status(200)
                .json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeStatus = changeStatus;
const edit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-edit")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            let listSlugTag = [];
            if (req.body.listTagName.length > 0) {
                listSlugTag = req.body.listTagName.map((item) => `${(0, slug_1.default)(item)}-${Date.now()}`);
            }
            const recordNew = {
                title: req.body.title,
                description: req.body.description || "",
                employerId: req.body.employerId,
                job_categorie_id: req.body.job_categorie_id,
                website: req.body.website || "",
                level: req.body.level,
                jobType: req.body.jobType,
                salaryMin: req.body.salaryMin,
                salaryMax: req.body.salaryMax,
                ageMin: req.body.ageMin || 0,
                ageMax: req.body.ageMax || 0,
                gender: req.body.gender,
                educationalLevel: req.body.educationalLevel,
                workExperience: req.body.workExperience,
                presentationLanguage: req.body.presentationLanguage,
                status: req.body.status,
                detailWorkExperience: req.body.detailWorkExperience || "",
                linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
                welfare: req.body.welfare,
                phone: req.body.phone,
                email: req.body.email,
                featured: req.body.featured,
                end_date: req.body.end_date,
                listTagName: req.body.listTagName || [],
                listTagSlug: listSlugTag,
                receiveEmail: req.body.receiveEmail,
                address: {
                    location: req.body.address,
                    linkMap: req.body.location || "",
                },
                city: req.body.city,
            };
            const id = req.params.id.toString();
            yield jobs_model_1.default.updateOne({ _id: id }, recordNew);
            res
                .status(200)
                .json({ success: "Cập Nhật Công Việc Thành Công!", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.edit = edit;
const changeMulti = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = req["userAdmin"].permissions;
            if (!permissions.includes("jobs-edit")) {
                res
                    .status(401)
                    .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
                return;
            }
            let KEY;
            (function (KEY) {
                KEY["STATUS"] = "status";
                KEY["DELETED"] = "deleted";
            })(KEY || (KEY = {}));
            let ids;
            let key;
            let value;
            if (!req.body.ids || !req.body.key) {
                res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
                return;
            }
            if (req.body.ids) {
                ids = req.body.ids;
            }
            if (req.body.key) {
                key = req.body.key.toString();
            }
            if (req.body.value) {
                value = req.body.value.toString();
            }
            switch (key) {
                case KEY.STATUS:
                    if (!(0, filterQueryStatus_1.filterQueryStatus)(value)) {
                        res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
                        return;
                    }
                    yield jobs_model_1.default.updateMany({ _id: { $in: ids } }, {
                        status: value,
                    });
                    res
                        .status(200)
                        .json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
                    break;
                case KEY.DELETED:
                    yield jobs_model_1.default.updateMany({ _id: ids }, {
                        deleted: true,
                        deletedAt: new Date(),
                    });
                    res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
                    break;
                default:
                    res.status(400).json({
                        error: "Yêu Cầu Không Hợp Lệ Hoặc Không Được Hỗ Trợ Vui Lòng Thử Lại!",
                        code: 400,
                    });
                    break;
            }
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeMulti = changeMulti;
