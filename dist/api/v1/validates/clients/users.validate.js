"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.editCvByUser = exports.uploadCv = exports.recruitmentJob = exports.changeEmailSuggestions = exports.changeJobSuggestions = exports.changeInfoUser = exports.changePassword = exports.allowSettingUser = exports.authen = exports.resetPassword = exports.checkToken = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../../../models/forgot-password.model"));
const md5 = __importStar(require("md5"));
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
function validatePassword(password) {
    if (password.length < 6) {
        return false;
    }
    if (password.length > 25) {
        return false;
    }
    return true;
}
function validatePhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const register = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateEmail(req.body.email)) {
            res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
            return;
        }
        const checkEmail = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (checkEmail) {
            res.status(401).json({ code: 401, error: "Email đã tồn tại!" });
            return;
        }
        if (!validatePassword(req.body.password)) {
            res.status(401).json({
                code: 401,
                error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
            });
            return;
        }
        if (!req.body.fullName) {
            res.status(401).json({ code: 401, error: "Vui Lòng Nhập Tên!" });
            return;
        }
        next();
    });
};
exports.register = register;
const login = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateEmail(req.body.email)) {
            res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
            return;
        }
        if (!req.body.password) {
            res.status(401).json({ code: 401, error: "Vui Lòng Nhập Mật Khẩu!" });
            return;
        }
        next();
    });
};
exports.login = login;
const forgotPassword = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        if (!validateEmail(email)) {
            res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
            return;
        }
        const record = yield forgot_password_model_1.default.findOne({
            email: email,
        });
        if (record) {
            const dateObject = new Date(record.timeWait);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - dateObject.getTime();
            const minutesDifference = Math.ceil(timeDifference / 1000);
            if (minutesDifference < 60) {
                res.status(401).json({
                    code: 401,
                    error: `Bạn không được gửi quá nhanh hãy thử Lại sau ${60 - minutesDifference} giây!`,
                });
                return;
            }
        }
        next();
    });
};
exports.forgotPassword = forgotPassword;
const checkToken = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.tokenReset) {
            res.status(401).json({ error: "Vui lòng nhập token!" });
            return;
        }
        const record = yield forgot_password_model_1.default.findOne({
            tokenReset: req.body.tokenReset,
        });
        if (!record) {
            res.status(401).json({
                code: 401,
                error: "Email này chưa được gửi otp vui lòng gửi otp và thử lại!",
            });
            return;
        }
        next();
    });
};
exports.checkToken = checkToken;
const resetPassword = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.email) {
            res.status(401).json({ error: "Vui lòng nhập email!" });
            return;
        }
        const record = yield forgot_password_model_1.default.findOne({
            email: req.body.email,
        });
        if (!record) {
            res.status(401).json({
                code: 401,
                error: "Email này chưa được gửi otp vui lòng gửi otp và thử lại!",
            });
            return;
        }
        if (!req.body.password) {
            res
                .status(401)
                .json({ code: 401, error: "Vui lòng không để trống mật khẩu!" });
            return;
        }
        if (!validatePassword(req.body.password)) {
            res.status(401).json({
                code: 401,
                error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
            });
            return;
        }
        if (req.body.password !== req.body.reEnterPassword) {
            res.status(401).json({
                code: 401,
                error: "Mật khẩu xác nhận chưa đúng!",
            });
            return;
        }
        next();
    });
};
exports.resetPassword = resetPassword;
const authen = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.token) {
            res.status(401).json({ code: 401, error: "Vui Lòng Nhập Token!" });
            return;
        }
        next();
    });
};
exports.authen = authen;
const allowSettingUser = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const keywordCheck = ["allow-search", "activate-job-search"];
        const keyword = req.body.keyword;
        const status = req.body.status;
        if (!keywordCheck.includes(keyword)) {
            res.status(401).json({ code: 401, error: "Keyword không hợp lệ!" });
            return;
        }
        if (typeof status !== "boolean") {
            res.status(401).json({ code: 401, error: "Status không hợp lệ!" });
            return;
        }
        next();
    });
};
exports.allowSettingUser = allowSettingUser;
const changePassword = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const password = req.body.password;
            const newPassword = req.body.newPassword;
            const reEnterPassword = req.body.reEnterPassword;
            const email = req["user"].email;
            const user = yield user_model_1.default.findOne({
                email: email,
                password: md5(password),
            });
            if (!user) {
                res.status(401).json({ code: 401, error: "Sai mật khẩu hiện tại!" });
                return;
            }
            if (user.status !== "active") {
                res.status(401).json({ code: 401, error: "Tài khoản đã bị khóa!" });
                return;
            }
            if (newPassword !== reEnterPassword) {
                res.status(401).json({ code: 401, error: "Mật khẩu mới không khớp!" });
                return;
            }
            if (newPassword === password) {
                res.status(401).json({
                    code: 401,
                    error: "Mật khẩu mới không được trùng mật khẩu cũ!",
                });
                return;
            }
            if (!validatePassword(newPassword)) {
                res.status(401).json({
                    code: 401,
                    error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changePassword = changePassword;
const changeInfoUser = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fullName = req.body.fullName;
            const phone = req.body.phone;
            const address = req.body.address;
            if (!fullName) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập tên!" });
                return;
            }
            if (!phone) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
                return;
            }
            if (!validatePhoneNumber(phone)) {
                res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
                return;
            }
            if (Object.keys(address).length === 0) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập địa chỉ!" });
                return;
            }
            if (!address["city"]) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập thành phố!" });
                return;
            }
            if (!address["district"]) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập quận/huyện!" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeInfoUser = changeInfoUser;
const changeJobSuggestions = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { gender, job_categorie_id, job_position, skill_id, yearsOfExperience, desiredSalary, workAddress, dateOfBirth, } = req.body;
            if (!gender) {
                res.status(401).json({ code: 401, error: "Vui lòng chọn giới tính!" });
                return;
            }
            if (!job_categorie_id) {
                res.status(401).json({ code: 401, error: "Vui lòng chọn ngành nghề!" });
                return;
            }
            if (!job_position) {
                res.status(401).json({ code: 401, error: "Vui lòng chọn vị trí!" });
                return;
            }
            if (!skill_id) {
                res.status(401).json({ code: 401, error: "Vui lòng chọn kỹ năng!" });
                return;
            }
            if (!yearsOfExperience) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn số năm kinh nghiệm!" });
                return;
            }
            if (!desiredSalary) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn mức lương mong muốn!" });
                return;
            }
            if (!workAddress) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn địa chỉ làm việc!" });
                return;
            }
            if (job_position.length < 1) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn ít nhất một vị trí!" });
                return;
            }
            if (skill_id.length < 1) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn ít nhất một kĩ năng!" });
                return;
            }
            if (workAddress.length < 1) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn ít nhất một địa chỉ!" });
                return;
            }
            if (job_position.length > 5) {
                res.status(401).json({
                    code: 401,
                    error: "Bạn chỉ được phép chọn 5 vị trí nếu là thành viên thường!",
                });
                return;
            }
            if (skill_id.length > 5) {
                res.status(401).json({
                    code: 401,
                    error: "Bạn chỉ được phép chọn 5 kĩ năng nếu là thành viên thường!",
                });
                return;
            }
            if (workAddress.length > 5) {
                res.status(401).json({
                    code: 401,
                    error: "Bạn chỉ được phép chọn 5 địa chỉ làm việc nếu là thành viên thường!",
                });
                return;
            }
            if (!dateOfBirth) {
                res.status(401).json({
                    code: 401,
                    error: "Vui lòng chọn ngày sinh!",
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeJobSuggestions = changeJobSuggestions;
const changeEmailSuggestions = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkEmailValidate = [
                "thong-bao-cap-nhat-quan-trong",
                "thong-bao-ntd-da-xem",
                "thong-bao-tinh-nang",
                "thong-bao-khac",
                "thong-bao-viec-lam-phu-hop",
                "thong-bao-ntd-moi-phong-van",
            ];
            const { emailCheck } = req.body;
            if (emailCheck.length > 0) {
                const hasInvalidChoice = emailCheck.every((element) => checkEmailValidate.includes(element));
                if (!hasInvalidChoice) {
                    res.status(401).json({
                        code: 401,
                        error: "Các lựa chọn của bạn có lựa chọn không hợp lệ!",
                    });
                    return;
                }
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeEmailSuggestions = changeEmailSuggestions;
const recruitmentJob = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idJob = req.body.idJob;
        if (!req.body.phone) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
            return;
        }
        if (!validatePhoneNumber(req.body.phone)) {
            res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
            return;
        }
        if (!req.body.email) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập email!" });
            return;
        }
        if (!req.body.idJob) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập jobIdd!" });
            return;
        }
        const exitsRequirement = yield jobs_model_1.default.findOne({
            _id: idJob,
            "listProfileRequirement.email": req["user"].email,
        });
        if (exitsRequirement) {
            res
                .status(401)
                .json({ code: 401, error: "Bạn đã ứng tuyển công việc này!" });
            return;
        }
        next();
    });
};
exports.recruitmentJob = recruitmentJob;
const uploadCv = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req["user"];
        const fileName = req.body.fileName;
        if (!fileName) {
            res.status(401).json({ code: 401, error: "Vui lòng chọn file!" });
            return;
        }
        const exitedCv = user.cv.find((cv) => cv.nameFile === fileName);
        if (exitedCv) {
            res.status(401).json({ code: 401, error: "File đã tồn tại!" });
            return;
        }
        next();
    });
};
exports.uploadCv = uploadCv;
const editCvByUser = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req["user"];
        const idFile = req.body.idFile;
        const newNameCv = req.body.newNameCv;
        if (!idFile) {
            res.status(401).json({ code: 401, error: "Vui lòng chọn file!" });
            return;
        }
        if (!newNameCv) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập tên file!" });
            return;
        }
        const checkCvName = user.cv.find((cv) => cv.nameFile === newNameCv && cv.idFile === idFile);
        if (checkCvName) {
            res.status(200).json({ code: 201, success: "Cập nhật CV thành công" });
            return;
        }
        next();
    });
};
exports.editCvByUser = editCvByUser;
