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
exports.deleteFollowProfile = exports.followUserProfile = exports.buyUserPreviewJob = exports.userPreviewJob = exports.actionCv = exports.getPdfToDriver = exports.editRecord = exports.editStatus = exports.createRecord = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuery_Validate_1 = require("../../../../helpers/filterQuery Validate");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const createRecord = (req, res, next) => {
    try {
        const title = req.body.title || "";
        const job_categorie_id = req.body.job_categorie_id || "";
        const level = req.body.level || "";
        const jobType = req.body.jobType || "";
        const welfare = req.body.welfare;
        const presentationLanguage = req.body.presentationLanguage;
        const salaryMin = parseInt(req.body.salaryMin);
        const salaryMax = parseInt(req.body.salaryMax);
        const gender = req.body.gender || "";
        const educationalLevel = req.body.educationalLevel || "";
        const workExperience = req.body.workExperience || "";
        const phone = req.body.phone || "";
        const email = req.body.email || "";
        const city = req.body.city;
        const end_date = new Date(req.body.end_date);
        const receiveEmail = req.body.receiveEmail || "";
        const address = req.body.address || "";
        if (!title) {
            res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
            return;
        }
        if (!job_categorie_id) {
            res.status(400).json({ error: "Vui Lòng Chọn Danh Mục Công Việc!" });
            return;
        }
        if (!jobType || jobType.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Loại Công Việc!" });
            return;
        }
        if (salaryMin < 1000000) {
            res.status(400).json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!" });
            return;
        }
        if (salaryMax < 1000000) {
            res.status(400).json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!" });
            return;
        }
        if (!gender) {
            res.status(400).json({ error: "Vui Lòng Chọn Giới Tính!" });
            return;
        }
        if (!level) {
            res.status(400).json({ error: "Vui Lòng Chọn Cấp Bậc!" });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryLevelJobs)(level)) {
            res.status(400).json({ error: "Dữ Liệu Cấp Bậc Không Hợp Lệ!" });
            return;
        }
        if (!educationalLevel) {
            res.status(400).json({ error: "Vui Lòng Chọn Trình Độ Học Vấn!" });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryEducationalLevelJobs)(educationalLevel)) {
            res.status(400).json({ error: "Dữ Liệu Trình Độ Học Vấn Không Hợp Lệ!" });
            return;
        }
        if (!workExperience) {
            res.status(400).json({ error: "Vui Lòng Chọn Kinh Nghiệm Làm Việc!" });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryWorkExperienceJobs)(workExperience)) {
            res.status(400).json({ error: "Dữ Liệu Kinh Nghiệm Không Hợp Lệ!" });
            return;
        }
        if (!welfare && welfare.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!" });
            return;
        }
        if (!city && city.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Thành Phố!" });
            return;
        }
        if (!presentationLanguage && presentationLanguage.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Ngôn Ngữ Trình Bày!" });
            return;
        }
        if (!phone) {
            res.status(400).json({ error: "Vui Lòng Nhập Số Điện Thoại!" });
            return;
        }
        if (!email) {
            res.status(400).json({ error: "Vui Lòng Nhập Email!" });
            return;
        }
        if (isNaN(end_date.getTime())) {
            res.status(400).json({ error: "Ngày Kết Thúc Không Hợp Lệ!" });
            return;
        }
        if (!receiveEmail) {
            res.status(400).json({ error: "Vui Lòng Chọn Ngôn Ngữ Nhận Email!" });
            return;
        }
        if (!address) {
            res.status(400).json({ error: "Vui Lòng Nhập Địa Chỉ!" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createRecord = createRecord;
const editStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req["user"];
    const status = req.body.status;
    if (!status) {
        res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
        return;
    }
    if (!(0, filterQueryStatus_1.filterQueryStatusJobsEmployer)(status)) {
        res
            .status(400)
            .json({ error: "Dữ liệu trạng thái không hợp lệ.", code: 400 });
        return;
    }
    const job = yield jobs_model_1.default.findOne({
        employerId: user._id,
        _id: req.params.id,
    });
    if (!job) {
        res.status(400).json({ error: "Dữ liệu không hợp lệ.", code: 400 });
        return;
    }
    if (!(0, filterQueryStatus_1.filterQueryStatusJobsEmployer)(job.status)) {
        res
            .status(400)
            .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
        return;
    }
    next();
});
exports.editStatus = editStatus;
const editRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.body.title || "";
        const job_categorie_id = req.body.job_categorie_id || "";
        const level = req.body.level || "";
        const jobType = req.body.jobType || "";
        const welfare = req.body.welfare;
        const presentationLanguage = req.body.presentationLanguage;
        const salaryMin = parseInt(req.body.salaryMin);
        const salaryMax = parseInt(req.body.salaryMax);
        const gender = req.body.gender || "";
        const educationalLevel = req.body.educationalLevel || "";
        const workExperience = req.body.workExperience || "";
        const phone = req.body.phone || "";
        const email = req.body.email || "";
        const city = req.body.city;
        const end_date = new Date(req.body.end_date);
        const receiveEmail = req.body.receiveEmail || "";
        const address = req.body.address || "";
        if (!title) {
            res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!job_categorie_id) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Danh Mục Công Việc!", code: 400 });
            return;
        }
        if (!jobType || jobType.length < 1) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Loại Công Việc!", code: 400 });
            return;
        }
        if (salaryMin < 1000000) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!", code: 400 });
            return;
        }
        if (salaryMax < 1000000) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!", code: 400 });
            return;
        }
        if (!gender) {
            res.status(400).json({ error: "Vui Lòng Chọn Giới Tính!", code: 400 });
            return;
        }
        if (!level) {
            res.status(400).json({ error: "Vui Lòng Chọn Cấp Bậc!", code: 400 });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryLevelJobs)(level)) {
            res
                .status(400)
                .json({ error: "Dữ Liệu Cấp Bậc Không Hợp Lệ!", code: 400 });
            return;
        }
        if (!educationalLevel) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Trình Độ Học Vấn!", code: 400 });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryEducationalLevelJobs)(educationalLevel)) {
            res
                .status(400)
                .json({ error: "Dữ Liệu Trình Độ Học Vấn Không Hợp Lệ!", code: 400 });
            return;
        }
        if (!workExperience) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Kinh Nghiệm Làm Việc!", code: 400 });
            return;
        }
        if (!(0, filterQuery_Validate_1.filterQueryWorkExperienceJobs)(workExperience)) {
            res
                .status(400)
                .json({ error: "Dữ Liệu Kinh Nghiệm Không Hợp Lệ!", code: 400 });
            return;
        }
        if (!welfare && welfare.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!", code: 400 });
            return;
        }
        if (!city && city.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Thành Phố!", code: 400 });
            return;
        }
        if (!presentationLanguage && presentationLanguage.length < 1) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Ngôn Ngữ Trình Bày!", code: 400 });
            return;
        }
        if (!phone) {
            res
                .status(400)
                .json({ error: "Vui Lòng Nhập Số Điện Thoại!", code: 400 });
            return;
        }
        if (!email) {
            res.status(400).json({ error: "Vui Lòng Nhập Email!", code: 400 });
            return;
        }
        if (isNaN(end_date.getTime())) {
            res.status(400).json({ error: "Ngày Kết Thúc Không Hợp Lệ!", code: 400 });
            return;
        }
        if (!receiveEmail) {
            res
                .status(400)
                .json({ error: "Vui Lòng Chọn Ngôn Ngữ Nhận Email!", code: 400 });
            return;
        }
        if (!address) {
            res.status(400).json({ error: "Vui Lòng Nhập Địa Chỉ!", code: 400 });
            return;
        }
        const job = yield jobs_model_1.default.findOne({ _id: req.params.id });
        if (!job) {
            res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
            return;
        }
        if (!(0, filterQueryStatus_1.filterQueryStatusJobsEmployer)(job.status)) {
            res
                .status(400)
                .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.editRecord = editRecord;
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
const actionCv = (req, res, next) => {
    try {
        if (!req.body.status) {
            res.status(400).json({ error: "Trạng Thái Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!req.body.idJob) {
            res
                .status(400)
                .json({ error: "ID Công Việc Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!req.body.email) {
            res.status(400).json({ error: "Email Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!(0, filterQueryStatus_1.filterQueryStatusCvJobsEmployer)(req.body.status)) {
            res
                .status(400)
                .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.actionCv = actionCv;
const userPreviewJob = (req, res, next) => {
    try {
        const idJob = req.body.idJob;
        if (!idJob) {
            res
                .status(400)
                .json({ error: "ID Công Việc Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.userPreviewJob = userPreviewJob;
const buyUserPreviewJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idJob = req.body.idJob;
        const idUser = req.body.idUser;
        if (!idJob) {
            res
                .status(400)
                .json({ error: "ID công việc chưa có dữ liệu!", code: 400 });
            return;
        }
        if (!idUser) {
            res
                .status(400)
                .json({ error: "ID người dùng chưa có dữ liệu!", code: 400 });
            return;
        }
        const jobCheckUser = yield jobs_model_1.default.findOne({
            _id: idJob,
            "listProfileViewJob.idUser": idUser,
        });
        if (!jobCheckUser) {
            res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
            return;
        }
        const jobCheck = yield jobs_model_1.default.findOne({
            _id: idJob,
            listProfileViewJob: {
                $elemMatch: {
                    idUser: idUser,
                    buy: true,
                },
            },
        });
        if (jobCheck) {
            res
                .status(400)
                .json({ error: "Bạn đã mua thông tin này rồi!", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.buyUserPreviewJob = buyUserPreviewJob;
const followUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idProfile = req.body.idProfile;
        const idJob = req.body.idJob;
        const user = req["user"];
        if (!idProfile) {
            res.status(400).json({ error: "ID Profile Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!idJob) {
            res.status(400).json({ error: "ID Job Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        const record = yield jobs_model_1.default.findOne({
            _id: idJob,
            employerId: user._id,
            "listProfileViewJob.idUser": idProfile,
        });
        if (!record) {
            res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.followUserProfile = followUserProfile;
const deleteFollowProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idProfile = req.body.idProfile;
        const idJob = req.body.idJob;
        const user = req["user"];
        if (!idProfile) {
            res.status(400).json({ error: "ID Profile Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        if (!idJob) {
            res.status(400).json({ error: "ID Job Chưa Có Dữ Liệu!", code: 400 });
            return;
        }
        const record = yield jobs_model_1.default.findOne({
            _id: idJob,
            employerId: user._id,
            "listProfileViewJob.idUser": idProfile,
        });
        if (!record) {
            res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteFollowProfile = deleteFollowProfile;
