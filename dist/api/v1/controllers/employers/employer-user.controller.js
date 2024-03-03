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
exports.authen = exports.resetPassword = exports.checkToken = exports.forgotPassword = exports.login = exports.register = void 0;
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const md5_1 = __importDefault(require("md5"));
const generateString_1 = require("../../../../helpers/generateString");
const forgot_password_employer_model_1 = __importDefault(require("../../../../models/forgot-password-employer.model"));
const sendMail_1 = require("../../../../helpers/sendMail");
const register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const userEmployer = yield employers_model_1.default.findOne({
                token: token,
            })
                .lean()
                .select("-password -token");
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
