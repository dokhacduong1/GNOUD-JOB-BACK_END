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
exports.verifyCodeSms = exports.verifyPassword = exports.sendEms = exports.changeEmailSuggestions = exports.changeJobSuggestions = exports.changeInfoCompany = exports.changeInfoUser = exports.changePassword = exports.allowSettingUser = exports.authen = exports.resetPassword = exports.checkToken = exports.forgotPassword = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const forgot_password_employer_model_1 = __importDefault(require("../../../../models/forgot-password-employer.model"));
const active_phone_employer_1 = __importDefault(require("../../../../models/active-phone-employer"));
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
function validatePhoneNumberInternational(phone) {
    const phoneRegex = /^\+\d{2,3}\d{9,10}$/;
    return phoneRegex.test(phone);
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function convertPhone(phone) {
    if (phone.startsWith("0")) {
        return phone.substring(1);
    }
    return phone;
}
const checkActivePhone = (activePhone, res) => {
    if (activePhone) {
        return true;
    }
    return false;
};
const checkExistingPhone = (phone, currentUserPhone, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (phone == currentUserPhone) {
        return false;
    }
    const checkPhone = yield employers_model_1.default.findOne({ phoneNumber: phone }).select("phone");
    if (checkPhone) {
        return true;
    }
    return false;
});
const checkRateLimit = (email, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield active_phone_employer_1.default.findOne({ email: email });
    if (record) {
        const dateObject = new Date(record.timeWait);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - dateObject.getTime();
        const minutesDifference = Math.ceil(timeDifference / 1000);
        if (minutesDifference < 180) {
            return {
                status: true,
                minutesDifference: minutesDifference,
            };
        }
    }
    yield active_phone_employer_1.default.deleteOne({ email: email });
    return false;
});
const register = function (req, res, next) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateEmail(req.body.email)) {
            res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
            return;
        }
        const checkEmail = yield employers_model_1.default.findOne({
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
        if (req.body.password !== req.body.reEnterPassword) {
            res.status(401).json({ code: 401, error: "Mật khẩu xác nhận chưa đúng!" });
            return;
        }
        if (!((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.address) === null || _b === void 0 ? void 0 : _b.city)) {
            res.status(401).json({ code: 401, error: "Vui lòng chọn thành phố!" });
            return;
        }
        if (!((_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.address) === null || _d === void 0 ? void 0 : _d.district)) {
            res.status(401).json({ code: 401, error: "Vui lòng chọn quận/huyện!" });
            return;
        }
        if (!req.body.companyName) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập tên công ty!" });
            return;
        }
        if (!req.body.gender) {
            res.status(401).json({ code: 401, error: "Vui lòng chọn giới tính!" });
            return;
        }
        if (!req.body.phoneNumber) {
            res.status(401).json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
            return;
        }
        if (!validatePhoneNumber(req.body.phoneNumber)) {
            res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
            return;
        }
        if (!req.body.level) {
            res
                .status(401)
                .json({ code: 401, error: "Vui lòng nhập vị trí công tác!" });
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
        const record = yield forgot_password_employer_model_1.default.findOne({
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
        const record = yield forgot_password_employer_model_1.default.findOne({
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
        const record = yield forgot_password_employer_model_1.default.findOne({
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
        if (!req.headers.authorization) {
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
            const user = yield employers_model_1.default.findOne({
                email: email,
                password: (0, md5_1.default)(password),
            });
            if (!user) {
                res.status(401).json({ code: 401, error: "Sai mật khẩu hiện tại!" });
                return;
            }
            if (user.status !== "active") {
                res.status(401).json({ code: 401, error: "Tài khoản đã bị khóa!" });
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
            const gender = req.body.gender;
            const level = req.body.level;
            if (!fullName) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập tên!" });
                return;
            }
            if (!gender) {
                res.status(401).json({ code: 401, error: "Vui lòng chọn giới tính!" });
                return;
            }
            if (!level) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng nhập vị trí công tác!" });
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
const changeInfoCompany = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.taxCodeCompany) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập mã số thuế" });
                return;
            }
            if (!req.body.addressCompany) {
                res
                    .status(401)
                    .json({
                    code: 401,
                    error: "Vui lòng chọn Tỉnh/thành phố, Quận/huyện, Phường/xã",
                });
                return;
            }
            if (!req.body.specificAddressCompany) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn địa chỉ chi tiết" });
                return;
            }
            if (!req.body.numberOfWorkers) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng chọn quy mô công ty" });
                return;
            }
            if (!req.body.emailCompany) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập email công ty" });
                return;
            }
            if (req.body["activityFieldList"].length < 1) {
                res
                    .status(401)
                    .json({
                    code: 401,
                    error: "Vui lòng chọn ít nhất một lĩnh vực hoạt động",
                });
                return;
            }
            if (!req.body["phoneCompany"]) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng nhập số điện thoại công ty" });
                return;
            }
            if (req.body.phoneCompany) {
                if (!validatePhoneNumber(req.body.phoneCompany)) {
                    res
                        .status(401)
                        .json({ code: 401, error: "Số điện thoại không hợp lệ" });
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
exports.changeInfoCompany = changeInfoCompany;
const changeJobSuggestions = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { gender, job_categorie_id, job_position, skill_id, yearsOfExperience, desiredSalary, workAddress, } = req.body;
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
const sendEms = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { activePhone, email, phoneNumber } = req["user"];
            let { phone } = req.body;
            if (checkActivePhone(activePhone, res)) {
                res
                    .status(401)
                    .json({ code: 401, error: "Số điện thoại đã được xác nhận!" });
                return;
            }
            const checkExistingPhoneOk = yield checkExistingPhone(phone, phoneNumber, res);
            if (checkExistingPhoneOk) {
                res
                    .status(401)
                    .json({ code: 401, error: "Số điện thoại đã được đăng ký!" });
                return;
            }
            const checkRateLimitOk = yield checkRateLimit(email, res);
            if (checkRateLimitOk["status"]) {
                res.status(401).json({
                    code: 401,
                    error: `Bạn không được gửi quá nhanh vui lòng thử Lại sau ${180 - checkRateLimitOk["minutesDifference"]} giây!`,
                });
                return;
            }
            if (!phone) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
                return;
            }
            phone = "+84" + convertPhone(phone);
            if (!validatePhoneNumberInternational(phone)) {
                res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
                return;
            }
            req.body.phone = phone;
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.sendEms = sendEms;
const verifyPassword = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.password) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập mật khẩu!" });
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
exports.verifyPassword = verifyPassword;
const verifyCodeSms = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const code = req.body.code;
            const activePhone = req["user"]["activePhone"];
            if (activePhone) {
                res
                    .status(401)
                    .json({ code: 401, error: "Số điện thoại đã được xác nhận!" });
                return;
            }
            if (!code) {
                res.status(401).json({ code: 401, error: "Vui lòng nhập mã xác nhận!" });
                return;
            }
            if (code.length !== 6) {
                res
                    .status(401)
                    .json({ code: 401, error: "Mã xác nhận phải có 6 ký tự!" });
                return;
            }
            if (!req.body.phone) {
                res
                    .status(401)
                    .json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
                return;
            }
            if (!validatePhoneNumber(req.body.phone)) {
                res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
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
exports.verifyCodeSms = verifyCodeSms;
