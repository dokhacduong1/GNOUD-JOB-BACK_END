"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employerSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    companyName: String,
    numberOfWorkers: Number,
    contactPersonName: String,
    phoneNumber: String,
    address: String,
    image: String,
    token: String,
    listApprovedUsers: Array,
    status: {
        type: String,
        default: "active"
    },
    cvRecruitment: [
        {
            userId: String,
            infoCv: String
        }
    ],
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
const Employer = mongoose_1.default.model("Employer", employerSchema, "employers");
exports.default = Employer;
