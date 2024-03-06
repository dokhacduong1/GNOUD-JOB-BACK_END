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
exports.verifyCode = exports.saveRecord = exports.sendCode = exports.getSession = void 0;
const axios_1 = __importDefault(require("axios"));
const active_phone_employer_1 = __importDefault(require("../models/active-phone-employer"));
const getSession = (tokenSMS) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, axios_1.default)({
        method: "get",
        url: "https://connect.speedsms.vn/speedsms/web/index.php/user/checkverify",
        headers: {
            Cookie: `_identity=${tokenSMS}`,
        },
    });
});
exports.getSession = getSession;
const sendCode = (session, phone) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, axios_1.default)({
        method: "post",
        url: "https://widgetapiv1.tingting.im/api/pin",
        data: {
            session: session,
            default: "SMS",
            allows: "SMS,VOICE",
            to: phone,
            lang: "en",
            country: "auto",
            channel: "SMS",
        },
    });
});
exports.sendCode = sendCode;
const saveRecord = (email, MSG_ID, session, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const recordSave = {
        email: email,
        msg_id: MSG_ID,
        session: session,
        phone: phone,
        timeWait: new Date(),
        expireAt: new Date(new Date().getTime() + 60 * 1000),
    };
    return yield active_phone_employer_1.default.create(recordSave);
});
exports.saveRecord = saveRecord;
const verifyCode = (phone, msg_id, code, session) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, axios_1.default)({
        method: "post",
        url: "https://widgetapiv1.tingting.im/api/verify",
        data: {
            to: phone,
            msg_id: msg_id,
            pin_code: code,
            session: session,
        },
    });
});
exports.verifyCode = verifyCode;
