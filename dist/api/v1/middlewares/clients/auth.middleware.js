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
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const auth = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const user = yield user_model_1.default.findOne({
                token: token
            }).select("-password -token");
            if (!user) {
                res.status(402).json({ error: "Dữ Liệu Người Dùng Không Hợp Lệ!", code: 402 });
                return;
            }
            req["user"] = user;
            next();
        }
        else {
            res.status(401).json({ error: "Bạn Không Có Quyền Truy Cập!" });
            return;
        }
    });
};
exports.auth = auth;
