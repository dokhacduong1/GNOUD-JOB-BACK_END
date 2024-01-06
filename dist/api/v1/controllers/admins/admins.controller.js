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
exports.info = exports.authen = exports.login = exports.index = void 0;
const admins_model_1 = __importDefault(require("../../../../models/admins.model"));
const md5_1 = __importDefault(require("md5"));
const encryptedData_1 = require("../../../../helpers/encryptedData");
const roles_model_1 = __importDefault(require("../../../../models/roles.model"));
const index = function (req, res) {
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
exports.index = index;
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = yield admins_model_1.default.findOne({
                email: email,
                password: (0, md5_1.default)(password),
            }).select("-password");
            if (!user) {
                res.status(401).json({ error: "Tài Khoản Hoặc Mật Khẩu Không Đúng!" });
                return;
            }
            if (user.status !== "active") {
                res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
                return;
            }
            const token = user.token;
            res.status(200).json({ success: "Đăng Nhập Thành Công!", token: token, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.login = login;
const authen = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.body.token;
            const populateCheck = [
                {
                    path: "role_id",
                    select: "title description permissions",
                    model: roles_model_1.default
                },
            ];
            const userAdmin = yield admins_model_1.default.findOne({
                token: token,
            }).select("-password -token").populate(populateCheck);
            const recordNew = {
                id: userAdmin._id,
                title: userAdmin.title,
                avatar: userAdmin.avatar,
                email: userAdmin.email,
                role_id: userAdmin.role_id["_id"],
                role_title: userAdmin.role_id["title"],
                role_description: userAdmin.role_id["description"],
                permissions: userAdmin.role_id["permissions"],
            };
            if (!userAdmin) {
                res.status(401).json({ error: "Xác Thực Thất Bại!" });
                return;
            }
            if (userAdmin.status !== "active") {
                res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
                return;
            }
            res.status(200).json({ success: "Xác Thự Thành Công!", token: token, code: 200, infoUser: recordNew });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.authen = authen;
const info = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const populateCheck = [
                {
                    path: "role_id",
                    select: "title description permissions",
                    model: roles_model_1.default
                },
            ];
            const record = yield admins_model_1.default.find({
                deleted: false,
                status: "active"
            }).select("title email avatar role_id").populate(populateCheck);
            const recordNew = [];
            record.forEach((item) => {
                recordNew.push({
                    id: item._id,
                    title: item.title,
                    avatar: item.avatar,
                    email: item.email,
                    role_title: item.role_id["title"],
                    role_description: item.role_id["description"],
                    permissions: item.role_id["permissions"],
                });
            });
            const dataEncrypted = (0, encryptedData_1.encryptedData)(recordNew);
            res.status(200).json({ data: dataEncrypted, code: 200 });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.info = info;
