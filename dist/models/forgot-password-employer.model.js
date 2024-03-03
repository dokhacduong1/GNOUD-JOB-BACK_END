"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const forgotPasswordSchema = new mongoose_1.default.Schema({
    email: String,
    tokenReset: String,
    timeWait: Date,
    expireAt: {
        type: Date,
    }
});
forgotPasswordSchema.index({ "lastModifiedDate": 1 }, { expireAfterSeconds: 11 });
const ForgotPasswordEmployer = mongoose_1.default.model("ForgotPasswordEmployer", forgotPasswordSchema, "forgot-password-employer");
exports.default = ForgotPasswordEmployer;
