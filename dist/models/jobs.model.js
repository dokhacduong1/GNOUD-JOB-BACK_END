"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var slug = require("mongoose-slug-updater");
mongoose_1.default.plugin(slug);
const jobSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    employerId: String,
    job_categorie_id: Array,
    website: String,
    level: String,
    jobType: Array,
    salaryMin: Number,
    salaryMax: Number,
    ageMin: Number,
    ageMax: Number,
    gender: String,
    educationalLevel: String,
    workExperience: String,
    detailWorkExperience: String,
    linkVideoAboutIntroducingJob: String,
    welfare: Array,
    presentationLanguage: Array,
    phone: String,
    email: String,
    listTagName: Array,
    listTagSlug: Array,
    receiveEmail: String,
    featured: Boolean,
    end_date: Date,
    deletedAt: Date,
    city: {
        slug: String,
        code: Number,
        name: String,
    },
    listUserId: {
        type: Array,
        default: [],
    },
    start_date: {
        type: Date,
        default: Date.now,
    },
    listProfileRequirement: {
        type: Array,
        default: [],
    },
    address: {
        location: String,
        linkMap: Array,
    },
    status: {
        type: String,
        default: "active",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
    keyword: {
        type: String,
        slug: "title",
        unique: true,
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date,
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date,
        },
    ],
}, {
    timestamps: true,
});
const Job = mongoose_1.default.model("Job", jobSchema, "jobs");
exports.default = Job;
