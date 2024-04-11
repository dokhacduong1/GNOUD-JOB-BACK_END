"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employerSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    fullName: String,
    contactPersonName: String,
    phoneNumber: String,
    code: String,
    level: String,
    token: String,
    listApprovedUsers: Array,
    gender: String,
    companyName: String,
    emailCompany: String,
    addressCompany: String,
    descriptionCompany: String,
    phoneCompany: String,
    website: String,
    numberOfWorkers: String,
    taxCodeCompany: String,
    specificAddressCompany: String,
    activityFieldList: {
        type: Array,
        default: []
    },
    logoCompany: {
        type: String,
        default: "https://res.cloudinary.com/dmmz10szo/image/upload/v1710149283/GNOUD_2_pxldrg.png"
    },
    activePhone: {
        type: Boolean,
        default: false
    },
    address: {
        city: String,
        district: String,
    },
    image: {
        type: String,
        default: "https://lh3.googleusercontent.com/d/1ILtAxkD9TrKMtGQkxX9eThmrMjCp49W0"
    },
    position: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        default: "active"
    },
    cointsGP: {
        type: Number,
        default: 0
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
