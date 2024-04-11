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
exports.authSocket = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const employers_model_1 = __importDefault(require("../../../models/employers.model"));
const findUserOrEmployer = (token, role) => __awaiter(void 0, void 0, void 0, function* () {
    let Role;
    (function (Role) {
        Role["CLIENT"] = "client";
        Role["EMPLOYER"] = "employer";
    })(Role || (Role = {}));
    if (role === Role.CLIENT) {
        const user = yield user_model_1.default.findOne({ token }).select("-password -token");
        return user;
    }
    if (role === Role.EMPLOYER) {
        const employer = yield employers_model_1.default.findOne({ token }).select("-password -token");
        return employer;
    }
    return [];
});
const authSocket = (io) => __awaiter(void 0, void 0, void 0, function* () {
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const token = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
        const role = (_d = (_c = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.role;
        if (!token || !role) {
            next(new Error("not authorized"));
        }
        let user = yield findUserOrEmployer(token, role);
        if (!user) {
            next(new Error("not authorized"));
        }
        socket["user"] = user;
        next();
    }));
});
exports.authSocket = authSocket;
