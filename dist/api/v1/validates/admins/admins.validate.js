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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authen = exports.login = void 0;
function validatePassword(password) {
    if (password.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/[a-z]/.test(password)) {
        return false;
    }
    if (!/[$@$!%*?&.]/.test(password)) {
        return false;
    }
    return true;
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const login = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateEmail(req.body.email)) {
            res.status(401).json({ error: "Email Không Hợp Lệ" });
            return;
        }
        if (!req.body.password) {
            res.status(401).json({ error: "Vui Lòng Nhập Mật Khẩu!" });
            return;
        }
        next();
    });
};
exports.login = login;
const authen = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.token) {
            res.status(401).json({ error: "Vui Lòng Nhập Token!" });
            return;
        }
        next();
    });
};
exports.authen = authen;
