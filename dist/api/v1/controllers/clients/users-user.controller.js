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
exports.changeEmailSuggestions = exports.changeJobSuggestions = exports.changeInfoUser = exports.changePassword = exports.authen = exports.list = exports.detail = exports.resetPassword = exports.checkToken = exports.forgotPassword = exports.login = exports.register = exports.uploadAvatar = exports.allowSettingUser = void 0;
const generateString_1 = require("../../../../helpers/generateString");
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../../../models/forgot-password.model"));
const sendMail_1 = require("../../../../helpers/sendMail");
const jobs_model_1 = __importDefault(require("../../../../models/jobs.model"));
const allowSettingUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyword = req.body.keyword;
            const status = Boolean(req.body.status);
            const email = req["user"]["email"];
            let keyStatus;
            (function (keyStatus) {
                keyStatus["allowSearch"] = "allow-search";
                keyStatus["activateJobSearch"] = "activate-job-search";
            })(keyStatus || (keyStatus = {}));
            switch (keyword) {
                case keyStatus.allowSearch:
                    yield user_model_1.default.updateOne({ email: email }, {
                        allowSearch: status,
                    });
                    break;
                case keyStatus.activateJobSearch:
                    yield user_model_1.default.updateOne({ email: email }, {
                        activeJobSearch: status,
                    });
                    break;
                default:
                    break;
            }
            res.status(200).json({ code: 200, success: `Thành Công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.allowSettingUser = allowSettingUser;
const uploadAvatar = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"]["email"];
            yield user_model_1.default.updateOne({ email: email }, {
                avatar: req.body["thumbUrl"],
            });
            res.status(200).json({ code: 200, success: `Thành Công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.uploadAvatar = uploadAvatar;
const register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const infoUser = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: (0, md5_1.default)(req.body.password),
                token: (0, generateString_1.generateRandomString)(30),
            };
            const user = new user_model_1.default(infoUser);
            yield user.save();
            const token = user.token;
            res.cookie("token", token);
            res
                .status(200)
                .json({ code: 200, success: "Tạo Tài Khoản Thành Công!", token: token });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ code: 500, error: "Internal Server Error" });
        }
    });
};
exports.register = register;
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = yield user_model_1.default.findOne({
                email: email,
                password: (0, md5_1.default)(password),
            });
            if (!user) {
                res
                    .status(401)
                    .json({ code: 401, error: "Tài Khoản Hoặc Mật Khẩu Không Đúng!" });
                return;
            }
            const token = user.token;
            res.cookie("token", token);
            res
                .status(200)
                .json({ code: 200, success: "Đăng Nhập Thành Công!", token: token });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ code: 500, error: "Internal Server Error" });
        }
    });
};
exports.login = login;
const forgotPassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const user = yield user_model_1.default.findOne({
                email: email,
                deleted: false,
            });
            if (!user) {
                res.status(401).json({ code: 401, error: "Tài Khoản Không Đúng!" });
                return;
            }
            const timeExpire = 4;
            const expireAtOk = new Date();
            expireAtOk.setMinutes(expireAtOk.getMinutes() + timeExpire);
            const objectForgotPassword = {
                email: email,
                tokenReset: (0, generateString_1.generateRandomString)(30),
                expireAt: expireAtOk,
                timeWait: new Date(new Date().getTime() + 60),
            };
            const checkRecord = yield forgot_password_model_1.default.findOne({
                email: email,
            });
            let tokenReset;
            if (checkRecord) {
                yield forgot_password_model_1.default.updateOne({
                    email: email,
                }, objectForgotPassword);
                tokenReset = objectForgotPassword.tokenReset;
            }
            else {
                const record = new forgot_password_model_1.default(objectForgotPassword);
                yield record.save();
                tokenReset = record.tokenReset;
            }
            const subject = "Reset mật khẩu";
            (0, sendMail_1.sendMail)(email, subject, tokenReset);
            res.status(200).json({
                code: 200,
                success: `Hãy kiểm tra email ${email} của bạn. Sau đó nhấn vào link trong hộp thư để đổi lại mật khẩu.`,
            });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.forgotPassword = forgotPassword;
const checkToken = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenReset = req.body.tokenReset;
            const record = yield forgot_password_model_1.default.findOne({
                tokenReset: tokenReset,
            });
            if (!record) {
                res.status(401).json({ code: 401, error: "Otp Không Hợp Lệ!" });
                return;
            }
            res.status(200).json({ code: 200, email: record.email });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.checkToken = checkToken;
const resetPassword = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const accept = (_a = req.body) === null || _a === void 0 ? void 0 : _a.accept;
            const user = yield user_model_1.default.findOne({
                email: email,
                deleted: false,
            });
            if (!user) {
                res.status(401).json({ error: "Tài Khoản Không Hợp Lệ!" });
                return;
            }
            let tokenNew;
            if (accept) {
                tokenNew = (0, generateString_1.generateRandomString)(30);
                yield user_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(password),
                    token: tokenNew,
                });
            }
            else {
                yield user_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(password),
                });
            }
            yield forgot_password_model_1.default.deleteOne({ email: email });
            res.status(200).json({ code: 200, success: `Đổi Mật Khẩu Thành Công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.resetPassword = resetPassword;
const detail = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req["user"];
        res.status(200).json({ success: `Thành Công!`, info: user });
    });
};
exports.detail = detail;
const list = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.find({
            deleted: false,
        }).select("fullName email");
        res.status(200).json({ success: `Thành Công!`, user: user });
    });
};
exports.list = list;
const authen = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.body.token;
            const userClient = yield user_model_1.default.findOne({
                token: token,
            })
                .lean()
                .select("-password -token");
            if (!userClient) {
                res.status(401).json({ error: "Xác Thực Thất Bại!" });
                return;
            }
            if (userClient.status !== "active") {
                res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
                return;
            }
            const convertData = [];
            if (((_a = userClient === null || userClient === void 0 ? void 0 : userClient.job_position) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const checkTag = yield jobs_model_1.default.find({
                    listTagSlug: { $in: userClient.job_position },
                }).select("listTagName listTagSlug");
                const userJobPositionsSet = new Set(userClient.job_position);
                checkTag.forEach((item) => {
                    item.listTagName.forEach((tag, index) => {
                        const tagSlug = item.listTagSlug[index];
                        if (userJobPositionsSet.has(tagSlug)) {
                            convertData.push({ label: tag, value: tagSlug });
                            userJobPositionsSet.delete(tagSlug);
                        }
                    });
                });
                userJobPositionsSet.forEach(function (value) {
                    const tag = value.replace(/-/g, " ");
                    convertData.push({ label: tag, value: value });
                });
            }
            const recordNew = {
                id: userClient._id,
                fullName: userClient.fullName,
                email: userClient.email,
                activeJobSearch: userClient.activeJobSearch,
                allowSearch: userClient.allowSearch,
                avatar: userClient.avatar,
                phone: userClient.phone || "",
                gender: userClient.gender || "",
                job_categorie_id: userClient.job_categorie_id || "",
                job_position: convertData || [],
                skill_id: userClient.skill_id || "",
                yearsOfExperience: userClient.yearsOfExperience || "",
                desiredSalary: userClient.desiredSalary || "",
                workAddress: userClient.workAddress || "",
                emailSuggestions: userClient.emailSuggestions || [],
            };
            res.status(200).json({
                success: "Xác Thự Thành Công!",
                token: token,
                code: 200,
                infoUser: recordNew,
            });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.authen = authen;
const changePassword = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newPassword = req.body.newPassword;
            const email = req["user"].email;
            const accept = (_a = req.body) === null || _a === void 0 ? void 0 : _a.accept;
            let tokenNew = "";
            if (accept) {
                tokenNew = (0, generateString_1.generateRandomString)(30);
                yield user_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(newPassword),
                    token: tokenNew,
                });
            }
            else {
                yield user_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(newPassword),
                });
            }
            res.status(200).json({
                code: 200,
                success: `Đổi mật khẩu thành công!`,
                tokenNew: tokenNew,
            });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changePassword = changePassword;
const changeInfoUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fullName = req.body.fullName;
            const phone = req.body.phone;
            const email = req["user"].email;
            yield user_model_1.default.updateOne({
                email: email,
            }, {
                fullName: fullName,
                phone: phone,
            });
            res
                .status(200)
                .json({ code: 200, success: `Thay đổi thông tin thành công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeInfoUser = changeInfoUser;
const changeJobSuggestions = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"].email;
            const { gender, job_categorie_id, job_position, skill_id, yearsOfExperience, desiredSalary, workAddress, } = req.body;
            yield user_model_1.default.updateOne({
                email: email,
            }, {
                gender,
                job_categorie_id,
                job_position,
                skill_id,
                yearsOfExperience,
                desiredSalary,
                workAddress,
            });
            res
                .status(200)
                .json({ code: 200, success: `Thay đổi thông tin thành công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeJobSuggestions = changeJobSuggestions;
const changeEmailSuggestions = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { emailCheck } = req.body;
            const email = req["user"].email;
            yield user_model_1.default.updateOne({ email: email }, { emailSuggestions: emailCheck });
            res.status(200).json({ code: 200, success: `Cập nhật thông báo qua email thành công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeEmailSuggestions = changeEmailSuggestions;
