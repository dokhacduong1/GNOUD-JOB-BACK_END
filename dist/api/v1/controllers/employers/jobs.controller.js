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
exports.deleteFollowProfile = exports.followUserJob = exports.followUserProfile = exports.infoUserProfile = exports.buyUserPreviewJob = exports.userPreviewJob = exports.coutViewCv = exports.actionCv = exports.getPdfToDriver = exports.infoJob = exports.changeMulti = exports.edit = exports.changeStatus = exports.deleteJobs = exports.create = exports.index = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQueryPagination_1 = require("../../../../helpers/filterQueryPagination.");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const slug_1 = __importDefault(require("slug"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const convertToSlug_1 = require("../../../../helpers/convertToSlug");
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const getFileToDriver_1 = require("../../../../helpers/getFileToDriver");
const sendMail_1 = require("../../../../helpers/sendMail");
const skills_model_1 = __importDefault(require("../../../../models/skills.model"));
const cvs_model_1 = __importDefault(require("../../../../models/cvs.model"));
const rooms_chat_model_1 = __importDefault(require("../../../../models/rooms-chat.model"));
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {
                deleted: false,
                employerId: req["user"]._id,
            };
            let queryStatus = "";
            let querySortKey = "";
            let querySortValue = "";
            let queryPage = 1;
            let queryLimit = 6;
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
            const dataEncrypted = (0, encryptedData_1.encryptedData)(records);
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
            const user = req["user"];
            let listSlugTag = [];
            if (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.listTagName) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                listSlugTag = req.body.listTagName.map((item) => `${(0, slug_1.default)(item)}-${Date.now()}`);
            }
            const Jobs = {
                title: req.body.title,
                description: req.body.description || "",
                employerId: user._id,
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
                detailWorkExperience: req.body.detailWorkExperience || "",
                linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
                welfare: req.body.welfare,
                phone: req.body.phone,
                email: req.body.email,
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
            res.status(201).json({ success: "Tạo Công Việc Thành Công!", code: 201 });
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
            const id = req.params.id.toString();
            const status = req.body.status.toString();
            yield jobs_model_1.default.updateOne({
                _id: id,
            }, {
                status: status,
            });
            res
                .status(200)
                .json({ success: "Cập nhật trạng thái thành công", code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeStatus = changeStatus;
const edit = function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let listSlugTag = [];
            if (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.listTagName) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                listSlugTag = req.body.listTagName.map((item) => `${(0, slug_1.default)(item)}-${Date.now()}`);
            }
            const Jobs = {
                title: req.body.title,
                description: req.body.description || "",
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
                detailWorkExperience: req.body.detailWorkExperience || "",
                linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
                welfare: req.body.welfare,
                phone: req.body.phone,
                email: req.body.email,
                end_date: req.body.end_date,
                listTagName: req.body.listTagName || [],
                listTagSlug: listSlugTag || [],
                receiveEmail: req.body.receiveEmail,
                status: "pending",
                address: {
                    location: req.body.address,
                    linkMap: req.body.location || "",
                },
                city: req.body.city,
            };
            const id = req.params.id.toString();
            yield jobs_model_1.default.updateOne({ _id: id }, Jobs);
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
const infoJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id || "";
        const user = req["user"];
        const status = req.query.status || "";
        const populateCheck = [
            {
                path: "job_categorie_id",
                select: "title",
                model: jobCategories_model_1.default,
            },
            {
                path: "listProfileRequirement",
                select: "",
                model: cvs_model_1.default,
                populate: [
                    {
                        path: "idUser",
                        select: "avatar fullName",
                        model: user_model_1.default,
                    },
                ],
            },
        ];
        let query = {
            _id: id,
            employerId: user._id,
            status: { $nin: ["pending", "refuse"] },
            deleted: false,
        };
        const record = yield jobs_model_1.default.findOne(query)
            .populate(populateCheck)
            .select("-employerId");
        if (status && record) {
            record.listProfileRequirement = record.listProfileRequirement.filter((item) => item.status === status);
        }
        if (!record) {
            res.status(200).json({ data: (0, encryptedData_1.encryptedData)([]), code: 200 });
            return;
        }
        const convertData = Object.assign(Object.assign({}, record.toObject()), { job_categories_title: record.job_categorie_id.map((item) => item.title) });
        const dataEncrypted = (0, encryptedData_1.encryptedData)(convertData);
        res.status(200).json({ data: dataEncrypted, code: 200 });
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.infoJob = infoJob;
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
const actionCv = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, idJob, status, } = req.body;
            const populateOptions = [
                {
                    path: "employerId",
                    select: "companyName",
                    model: employers_model_1.default,
                },
                {
                    path: "listProfileRequirement",
                    select: "",
                    model: cvs_model_1.default,
                    populate: [
                        {
                            path: "idUser",
                            select: "fullName",
                            model: user_model_1.default,
                        },
                    ],
                },
            ];
            const emailSubject = "Thông Báo Tuyển Dụng";
            const jobRecord = yield jobs_model_1.default.findOne({ _id: idJob }).populate(populateOptions);
            if (!jobRecord) {
                res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
                return;
            }
            const profile = jobRecord.listProfileRequirement.find((item) => item.email === email);
            jobRecord["profileName"] = profile === null || profile === void 0 ? void 0 : profile.idUser["fullName"];
            if (status === "refuse") {
                const checkCv = yield cvs_model_1.default.findOneAndUpdate({
                    email: email,
                    idJob: idJob,
                }, {
                    status: "refuse"
                });
                if (checkCv) {
                    yield jobs_model_1.default.updateOne({
                        "listProfileRequirement": checkCv._id
                    }, {
                        $pull: { listProfileRequirement: checkCv._id }
                    });
                }
                yield (0, sendMail_1.sendMailEmployerRefureCv)(email, emailSubject, jobRecord);
            }
            else if (status === "accept") {
                yield cvs_model_1.default.updateOne({ email: email, idJob: idJob }, { status: "accept" });
                yield jobs_model_1.default.updateOne({});
                yield (0, sendMail_1.sendMailEmployerAcceptCv)(email, emailSubject, jobRecord);
                const exitedRoomChatFriend = yield rooms_chat_model_1.default.findOne({
                    "users.user_id": profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                    "users.employer_id": profile["employerId"],
                    typeRoom: "friend",
                });
                if (!exitedRoomChatFriend) {
                    const chatRoomData = {
                        typeRoom: "friend",
                        users: [
                            {
                                user_id: profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                                id_check: profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                                role: "super-admin",
                            },
                            {
                                employer_id: profile["employerId"],
                                id_check: profile["employerId"],
                                role: "super-admin",
                            },
                        ],
                    };
                    const chatRoom = new rooms_chat_model_1.default(chatRoomData);
                    yield chatRoom.save();
                }
                const roomChatGroupExit = yield rooms_chat_model_1.default.findOne({
                    "users.employer_id": profile["employerId"],
                    typeRoom: "group",
                    "users.user_id": profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                });
                if (!roomChatGroupExit) {
                    yield rooms_chat_model_1.default.findOneAndUpdate({
                        "users.employer_id": profile["employerId"],
                        typeRoom: "group",
                    }, {
                        $push: {
                            users: {
                                user_id: profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                                id_check: profile === null || profile === void 0 ? void 0 : profile.idUser["_id"],
                                role: "user",
                            },
                        },
                    });
                }
            }
            res.status(200).json({ code: 200, success: "Cập nhật dữ liệu thành công" });
        }
        catch (error) {
            console.error("Lỗi trong API:", error);
            res.status(500).json({ error: "Lỗi Máy Chủ Nội Bộ" });
        }
    });
};
exports.actionCv = actionCv;
const coutViewCv = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, idJob } = req.body;
            const record = yield cvs_model_1.default.findOneAndUpdate({
                email: email,
                idJob: idJob,
            }, {
                $inc: { countView: 1 },
            });
            if (!record) {
                res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
                return;
            }
            res.status(200).json({ code: 200, success: "Cập nhật dữ liệu thành công" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.coutViewCv = coutViewCv;
const userPreviewJob = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req["user"];
            const idJob = req.body.idJob;
            const populateCheck = [
                {
                    path: "listProfileViewJob.idUser",
                    select: " -password -token -status -deleted -createdAt -updatedAt",
                    model: user_model_1.default,
                    populate: [
                        {
                            path: "job_categorie_id",
                            select: "title",
                            model: jobCategories_model_1.default,
                        },
                    ],
                },
            ];
            const job = yield jobs_model_1.default.findOne({ employerId: user._id, _id: idJob })
                .populate(populateCheck)
                .select("listProfileViewJob");
            if (!job || !job.listProfileViewJob) {
                res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
                return;
            }
            const dataConvert = job.listProfileViewJob.map((item) => {
                if (!item.buy) {
                    item["idUser"].email = "";
                    item["idUser"].phone = "";
                }
                return Object.assign(Object.assign({}, item.idUser.toObject()), { dataTime: item.dataTime });
            });
            res.status(200).json({ data: dataConvert, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.userPreviewJob = userPreviewJob;
const buyUserPreviewJob = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const maxBuy = 10;
            const user = req["user"];
            const cointsGP = user["cointsGP"];
            if (cointsGP < maxBuy) {
                res.status(400).json({ error: "Bạn không đủ GP để mua dịch vụ này" });
                return;
            }
            const idJob = req.body.idJob;
            const idUser = req.body.idUser;
            yield jobs_model_1.default.updateOne({
                employerId: user._id,
                _id: idJob,
                "listProfileViewJob.idUser": idUser,
            }, {
                $set: { "listProfileViewJob.$.buy": true },
            });
            yield employers_model_1.default.updateOne({
                _id: user._id,
            }, {
                $inc: { cointsGP: -maxBuy },
            });
            res.status(200).json({ code: 200, success: "Bạn đã mua thành công" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.buyUserPreviewJob = buyUserPreviewJob;
const infoUserProfile = function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = req["user"]) === null || _a === void 0 ? void 0 : _a._id;
            const idUser = req.body.idUser;
            const idJob = req.body.idJob;
            const populateCheck = [
                {
                    path: "skill_id",
                    select: "title",
                    model: skills_model_1.default,
                },
                {
                    path: "job_categorie_id",
                    select: "title",
                    model: jobCategories_model_1.default,
                },
            ];
            const findJob = yield jobs_model_1.default.findOne({
                _id: idJob,
                employerId: userId,
                listProfileViewJob: { $elemMatch: { idUser: idUser, buy: true } },
            }).select("_id");
            const defaultSelect = (findJob === null || findJob === void 0 ? void 0 : findJob._id)
                ? "-password -token -status -deleted -createdAt -updatedAt"
                : "-password -token -status -deleted -createdAt -updatedAt -email -phone";
            const result = yield user_model_1.default.findOne({ _id: idUser })
                .select(defaultSelect)
                .populate(populateCheck);
            const count = [
                Object.keys(result === null || result === void 0 ? void 0 : result.skill_id).length > 0,
                result === null || result === void 0 ? void 0 : result.desiredSalary,
                (_b = result === null || result === void 0 ? void 0 : result.address) === null || _b === void 0 ? void 0 : _b.city,
                result === null || result === void 0 ? void 0 : result.yearsOfExperience,
                result === null || result === void 0 ? void 0 : result.dateOfBirth,
            ].filter(Boolean).length;
            const objectNew = Object.assign(Object.assign({}, result.toObject()), { authentication_level: count });
            res.status(200).json({ code: 200, data: objectNew });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.infoUserProfile = infoUserProfile;
const followUserProfile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idProfile = req.body.idProfile;
            const idJob = req.body.idJob;
            const user = req["user"];
            yield jobs_model_1.default.updateOne({
                _id: idJob,
                employerId: user._id,
                "listProfileViewJob.idUser": idProfile,
            }, {
                $set: { "listProfileViewJob.$.follow": true },
            });
            res.status(200).json({ code: 200, success: "Bạn đã theo dõi người dùng" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.followUserProfile = followUserProfile;
const followUserJob = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req["user"]._id;
            const idJob = req.body.idJob;
            const populateCheck = [
                {
                    path: "listProfileViewJob.idUser",
                    select: " -password -token -status -deleted -createdAt -updatedAt",
                    model: user_model_1.default,
                    populate: [
                        {
                            path: "job_categorie_id",
                            select: "title",
                            model: jobCategories_model_1.default,
                        },
                    ],
                },
            ];
            const job = yield jobs_model_1.default.findOne({
                employerId: userId,
                _id: idJob,
                "listProfileViewJob.follow": true,
            })
                .populate(populateCheck)
                .select("listProfileViewJob");
            if (!job || !job.listProfileViewJob) {
                res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
                return;
            }
            const dataConvert = job.listProfileViewJob
                .filter((itemFilter) => itemFilter.follow === true)
                .map((item) => {
                if (!item.buy) {
                    item["idUser"].email = "";
                    item["idUser"].phone = "";
                }
                return Object.assign(Object.assign({}, item.idUser.toObject()), { dataTime: item.dataTime });
            });
            res.status(200).json({ data: dataConvert, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.followUserJob = followUserJob;
const deleteFollowProfile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idProfile = req.body.idProfile;
            const idJob = req.body.idJob;
            const userId = req["user"]._id;
            yield jobs_model_1.default.updateOne({
                _id: idJob,
                employerId: userId,
                "listProfileViewJob.idUser": idProfile,
            }, {
                $set: { "listProfileViewJob.$.follow": false },
            });
            res
                .status(200)
                .json({ code: 200, success: "Bạn đã hủy theo dõi người dùng" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.deleteFollowProfile = deleteFollowProfile;
