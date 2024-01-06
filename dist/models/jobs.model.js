"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var slug = require('mongoose-slug-updater');
mongoose_1.default.plugin(slug);
const jobSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    employerId: String,
    job_categorie_id: Array,
    website: String,
    level: String,
    jobType: String,
    salary: Number,
    age: Number,
    gender: String,
    educationalLevel: String,
    workExperience: Number,
    detailWorkExperience: String,
    welfare: Array,
    address: String,
    phone: String,
    email: String,
    keyword: String,
    listUserId: Array,
    featured: Boolean,
    end_date: Date,
    start_date: Date,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
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
const Job = mongoose_1.default.model("Job", jobSchema, "jobs");
exports.default = Job;
