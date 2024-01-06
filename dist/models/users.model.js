"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    address: String,
    phone: String,
    educationalLevel: String,
    schoolName: String,
    foreignLanguage: String,
    yearsOfExperience: Number,
    companyName: String,
    jobTitle: String,
    skill: Array,
    specializationId: String,
    gender: String,
    image: String,
    token: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
}, {
    timestamps: true
});
const User = mongoose_1.default.model("User", userSchema, "users");
exports.default = User;
