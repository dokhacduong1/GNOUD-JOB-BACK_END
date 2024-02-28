"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editRecord = exports.editStatus = exports.createRecord = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const filterQuery_Validate_1 = require("../../../../helpers/filterQuery Validate");
const createRecord = (req, res, next) => {
    try {
        const title = req.body.title.toString();
        const employerId = req.body.employerId.toString();
        const job_categorie_id = req.body.job_categorie_id.toString();
        const level = req.body.level.toString();
        const jobType = req.body.jobType.toString();
        const welfare = req.body.welfare;
        const presentationLanguage = req.body.presentationLanguage;
        const salaryMin = parseInt(req.body.salaryMin);
        const salaryMax = parseInt(req.body.salaryMax);
        const gender = req.body.gender.toString();
        const educationalLevel = req.body.educationalLevel.toString();
        const workExperience = req.body.workExperience.toString();
        const status = req.body.status.toString();
        const phone = req.body.phone.toString();
        const email = req.body.email.toString();
        const featured = req.body.featured;
        const city = req.body.city;
        const end_date = new Date(req.body.end_date);
        const receiveEmail = req.body.receiveEmail.toString();
        const address = req.body.address.toString();
        if (!title) {
            res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
            return;
        }
        if (!employerId) {
            res.status(400).json({ error: "Vui Lòng Chọn Công Ty!" });
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
        if (!status) {
            res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
            return;
        }
        if (!(0, filterQueryStatus_1.filterQueryStatusJobs)(status)) {
            res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!" });
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
        if (featured === undefined) {
            res.status(400).json({ error: "Vui Lòng Chọn Nổi Bật!" });
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
const editStatus = (req, res, next) => {
    const status = req.body.status;
    if (!status) {
        res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
        return;
    }
    if (!(0, filterQueryStatus_1.filterQueryStatusJobs)(status)) {
        res.status(400).json({ error: "Dữ Liệu  Trạng Thái Không Hợp Lệ!", code: 400 });
        return;
    }
    next();
};
exports.editStatus = editStatus;
const editRecord = (req, res, next) => {
    try {
        const title = req.body.title.toString();
        const employerId = req.body.employerId.toString();
        const job_categorie_id = req.body.job_categorie_id.toString();
        const level = req.body.level.toString();
        const jobType = req.body.jobType.toString();
        const welfare = req.body.welfare;
        const presentationLanguage = req.body.presentationLanguage;
        const salaryMin = parseInt(req.body.salaryMin);
        const salaryMax = parseInt(req.body.salaryMax);
        const gender = req.body.gender.toString();
        const educationalLevel = req.body.educationalLevel.toString();
        const workExperience = req.body.workExperience.toString();
        const status = req.body.status.toString();
        const phone = req.body.phone.toString();
        const email = req.body.email.toString();
        const featured = req.body.featured;
        const end_date = new Date(req.body.end_date);
        const receiveEmail = req.body.receiveEmail.toString();
        const address = req.body.address.toString();
        if (!title) {
            res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
            return;
        }
        if (!employerId) {
            res.status(400).json({ error: "Vui Lòng Chọn Công Ty!" });
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
        if (!status) {
            res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
            return;
        }
        if (!(0, filterQueryStatus_1.filterQueryStatusJobs)(status)) {
            res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!" });
            return;
        }
        if (!welfare && welfare.length < 1) {
            res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!" });
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
        if (featured === undefined) {
            res.status(400).json({ error: "Vui Lòng Chọn Nổi Bật!" });
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
exports.editRecord = editRecord;
