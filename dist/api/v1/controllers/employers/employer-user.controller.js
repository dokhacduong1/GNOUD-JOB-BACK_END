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
exports.changePasswordEmployer = exports.verifyCodeSms = exports.verifyPassword = exports.sendEms = exports.changeInfoCompany = exports.changeInfoEmployer = exports.uploadAvatar = exports.authen = exports.resetPassword = exports.checkToken = exports.forgotPassword = exports.login = exports.register = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const md5_1 = __importDefault(require("md5"));
const generateString_1 = require("../../../../helpers/generateString");
const forgot_password_employer_model_1 = __importDefault(require("../../../../models/forgot-password-employer.model"));
const sendMail_1 = require("../../../../helpers/sendMail");
const employer_counter_1 = __importDefault(require("../../../../models/employer-counter"));
const active_phone_employer_1 = __importDefault(require("../../../../models/active-phone-employer"));
const smsPhoneSend_1 = require("../../../../helpers/smsPhoneSend");
const jobCategories_model_1 = __importDefault(require("../../../../models/jobCategories.model"));
const register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const counter = yield employer_counter_1.default.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
            const infoUser = {
                address: req.body.address,
                companyName: req.body.companyName,
                fullName: req.body.fullName,
                gender: req.body.gender,
                level: req.body.level,
                linkedin: req.body.linkedin || "",
                password: (0, md5_1.default)(req.body.password),
                token: (0, generateString_1.generateRandomString)(30),
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                code: counter.count.toString(),
            };
            const userEmployer = new employers_model_1.default(infoUser);
            yield userEmployer.save();
            const token = userEmployer.token;
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
            const user = yield employers_model_1.default.findOne({
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
            const user = yield employers_model_1.default.findOne({
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
            const checkRecord = yield forgot_password_employer_model_1.default.findOne({
                email: email,
            });
            let tokenReset;
            if (checkRecord) {
                yield forgot_password_employer_model_1.default.updateOne({
                    email: email,
                }, objectForgotPassword);
                tokenReset = objectForgotPassword.tokenReset;
            }
            else {
                const record = new forgot_password_employer_model_1.default(objectForgotPassword);
                yield record.save();
                tokenReset = record.tokenReset;
            }
            const subject = "Reset mật khẩu";
            (0, sendMail_1.sendMailEmployer)(email, subject, tokenReset);
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
            const record = yield forgot_password_employer_model_1.default.findOne({
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
            const user = yield employers_model_1.default.findOne({
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
                yield employers_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(password),
                    token: tokenNew,
                });
            }
            else {
                yield employers_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(password),
                });
            }
            yield forgot_password_employer_model_1.default.deleteOne({ email: email });
            res.status(200).json({ code: 200, success: `Đổi Mật Khẩu Thành Công!` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.resetPassword = resetPassword;
const authen = function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const populateCheck = [
                {
                    path: "activityFieldList",
                    select: "title",
                    model: jobCategories_model_1.default,
                }
            ];
            const userEmployer = yield employers_model_1.default.findOne({
                token: token,
            })
                .lean()
                .select("-password -token").populate(populateCheck);
            if (!userEmployer) {
                res.status(401).json({ error: "Xác Thực Thất Bại!" });
                return;
            }
            if (userEmployer.status !== "active") {
                res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
                return;
            }
            const recordNew = {
                id: userEmployer._id,
                fullName: userEmployer.fullName,
                email: userEmployer.email,
                phoneNumber: userEmployer.phoneNumber,
                code: userEmployer.code,
                image: userEmployer.image,
                gender: userEmployer.gender,
                level: userEmployer.level,
                cointsGP: userEmployer.cointsGP,
                activePhone: userEmployer.activePhone,
                companyName: userEmployer.companyName,
                emailCompany: userEmployer.emailCompany || "- -",
                addressCompany: userEmployer.addressCompany || "- -",
                descriptionCompany: userEmployer.descriptionCompany || "- -",
                phoneCompany: userEmployer.phoneCompany || "- -",
                website: userEmployer.website || "- -",
                numberOfWorkers: userEmployer.numberOfWorkers || "- -",
                activityFieldList: ((_a = userEmployer === null || userEmployer === void 0 ? void 0 : userEmployer.activityFieldList) === null || _a === void 0 ? void 0 : _a.map(item => item._id)) || "- -",
                activityFieldListName: ((_b = userEmployer === null || userEmployer === void 0 ? void 0 : userEmployer.activityFieldList) === null || _b === void 0 ? void 0 : _b.map(item => item.title).join(", ")) || "- -",
                taxCodeCompany: userEmployer.taxCodeCompany || "- -",
                specificAddressCompany: userEmployer.specificAddressCompany || "- -",
                logoCompany: userEmployer.logoCompany || "",
            };
            res.status(200).json({
                success: "Xác Thự Thành Công!",
                token: token,
                code: 200,
                infoUserEmployer: recordNew,
            });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.authen = authen;
const uploadAvatar = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"]["email"];
            yield employers_model_1.default.updateOne({ email: email }, {
                image: req.body["thumbUrl"],
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
const changeInfoEmployer = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"]["email"];
            const record = {
                level: req.body.level,
                gender: req.body.gender,
                fullName: req.body.fullName,
            };
            if (req.body.linkedin) {
                record.linkedin = req.body.linkedin;
            }
            yield employers_model_1.default.updateOne({
                email: email,
            }, record);
            res.status(200).json({ code: 200, success: `Cập nhật dữ liệu thành công` });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeInfoEmployer = changeInfoEmployer;
const changeInfoCompany = function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"]["email"];
            console.log(req.body["thumbUrl"]);
            const record = {
                companyName: req.body.companyName,
                emailCompany: req.body.emailCompany,
                addressCompany: req.body.addressCompany,
                phoneCompany: req.body.phoneCompany,
                numberOfWorkers: req.body.numberOfWorkers,
                activityFieldList: req.body.activityFieldList,
                taxCodeCompany: req.body.taxCodeCompany,
                specificAddressCompany: req.body.specificAddressCompany,
            };
            if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.website) {
                record["website"] = req.body.website;
            }
            if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.descriptionCompany) {
                record["descriptionCompany"] = req.body.descriptionCompany;
            }
            if (req.body["thumbUrl"]) {
                record["logoCompany"] = req.body["thumbUrl"];
            }
            yield employers_model_1.default.updateOne({
                email: email,
            }, record);
            res.status(200).json({ code: 200, success: "Cập nhật dữ liệu thành công" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.changeInfoCompany = changeInfoCompany;
const sendEms = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req["user"]["email"];
            const phone = req.body.phone;
            const tokenSMS = process.env.TOKEN_SPEEDSMS;
            const responseSession = yield (0, smsPhoneSend_1.getSession)(tokenSMS);
            if (responseSession["data"] && responseSession["data"]["verify"]) {
                const session = responseSession["data"]["data"]["session"];
                const responseSendCode = yield (0, smsPhoneSend_1.sendCode)(session, phone);
                if (responseSendCode["data"] &&
                    responseSendCode["data"]["status"] === "success") {
                    const MSG_ID = responseSendCode["data"]["data"]["msg_id"];
                    yield (0, smsPhoneSend_1.saveRecord)(email, MSG_ID, session, phone);
                    res.status(200).json({
                        code: 200,
                        success: "Đã gửi tin nhắn thành công tới số điện thoại của bạn",
                    });
                    return;
                }
                if (responseSendCode["data"] &&
                    responseSendCode["data"]["status"] === "error") {
                    if (responseSendCode["data"]["message"] === "Invalid phone number format") {
                        res
                            .status(400)
                            .json({ code: 400, error: "Số điện thoại không hợp lệ" });
                        return;
                    }
                    if (responseSendCode["data"]["status"] === "error" &&
                        responseSendCode["data"]["count_down"] > 0) {
                        res.status(400).json({
                            code: 400,
                            error: `Bạn đã gửi tin nhắn quá nhanh xin vui thử lại sau ${responseSendCode["data"]["count_down"]} giây`,
                        });
                        return;
                    }
                }
                res.status(400).json({
                    code: 400,
                    error: "Đã có một số lỗi gì đó vui lòng thử lại",
                });
            }
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.sendEms = sendEms;
const verifyPassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const password = req.body.password;
            const email = req["user"]["email"];
            const user = yield employers_model_1.default.findOne({
                email: email,
                password: (0, md5_1.default)(password),
                status: "active",
            });
            if (!user) {
                res.status(401).json({ code: 401, error: "Mật khẩu không đúng" });
                return;
            }
            if (user["status"] !== "active") {
                res.status(401).json({ code: 401, error: "Tài khoản đã bị khóa" });
                return;
            }
            res.status(200).json({ code: 200, success: "Xác thực thành công" });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.verifyPassword = verifyPassword;
const verifyCodeSms = function (req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code, phone } = req.body;
            const email = req["user"]["email"];
            const record = yield active_phone_employer_1.default.findOne({ email });
            if (!record) {
                res.status(401).json({ code: 401, error: "Không tìm thấy thông tin!" });
                return;
            }
            const responseVerifyCode = yield (0, smsPhoneSend_1.verifyCode)(record.phone, record.msg_id, code, record.session);
            const responseData = (_a = responseVerifyCode === null || responseVerifyCode === void 0 ? void 0 : responseVerifyCode.data) === null || _a === void 0 ? void 0 : _a.data;
            if (((_b = responseVerifyCode === null || responseVerifyCode === void 0 ? void 0 : responseVerifyCode.data) === null || _b === void 0 ? void 0 : _b.status) === "success") {
                if ((responseData === null || responseData === void 0 ? void 0 : responseData.verified) === 1) {
                    yield active_phone_employer_1.default.deleteOne({ email });
                    yield employers_model_1.default.updateOne({ email }, { activePhone: true, phoneNumber: phone });
                    res.status(200).json({ code: 200, success: "Xác thực thành công" });
                    return;
                }
                else if ((responseData === null || responseData === void 0 ? void 0 : responseData.verified) === 2) {
                    res.status(401).json({
                        code: 401,
                        error: "Tài khoản của bạn đã sai mã xác thực quá nhiều lần vui lòng thử lại sau",
                    });
                    return;
                }
            }
            else if (((_c = responseVerifyCode === null || responseVerifyCode === void 0 ? void 0 : responseVerifyCode.data) === null || _c === void 0 ? void 0 : _c.status) === "error" &&
                ((_d = responseVerifyCode === null || responseVerifyCode === void 0 ? void 0 : responseVerifyCode.data) === null || _d === void 0 ? void 0 : _d.message) === "session not found or expired") {
                yield active_phone_employer_1.default.deleteOne({ email });
                res
                    .status(401)
                    .json({ code: 401, error: "Mã xác thực đã hết hạn vui lòng thử lại" });
                return;
            }
            res
                .status(401)
                .json({ code: 401, error: "Xác thực thất bại vui lòng thử lại" });
            return;
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    });
};
exports.verifyCodeSms = verifyCodeSms;
const changePasswordEmployer = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newPassword = req.body.newPassword;
            const email = req["user"].email;
            const accept = (_a = req.body) === null || _a === void 0 ? void 0 : _a.accept;
            let tokenNew = "";
            if (accept) {
                tokenNew = (0, generateString_1.generateRandomString)(30);
                yield employers_model_1.default.updateOne({ email: email }, {
                    password: (0, md5_1.default)(newPassword),
                    token: tokenNew,
                });
            }
            else {
                yield employers_model_1.default.updateOne({ email: email }, {
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
exports.changePasswordEmployer = changePasswordEmployer;
