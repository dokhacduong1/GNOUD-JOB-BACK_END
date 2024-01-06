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
exports.auth = void 0;
const admins_model_1 = __importDefault(require("../../../../models/admins.model"));
const roles_model_1 = __importDefault(require("../../../../models/roles.model"));
const auth = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.headers) {
                const token = req.headers.authorization.split(" ")[1];
                const populateCheck = [
                    {
                        path: "role_id",
                        select: "title description permissions",
                        model: roles_model_1.default
                    },
                ];
                const userAdmin = yield admins_model_1.default.findOne({
                    token: token
                }).select("-password -token").populate(populateCheck);
                if (!userAdmin) {
                    res.status(401).json({ error: "Dữ Liệu Người Dùng Không Hợp Lệ Vui Lòng Tải Lại Trang!" });
                    return;
                }
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
                req["userAdmin"] = recordNew;
                next();
            }
            else {
                res.status(401).json({ error: "Bạn Không Có Quyền Truy Cập!" });
                return;
            }
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.auth = auth;
