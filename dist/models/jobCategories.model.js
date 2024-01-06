"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var slug = require('mongoose-slug-updater');
const jobCategoriesSchema = new mongoose_1.default.Schema({
    title: String,
    parent_id: String,
    position: Number,
    thumbnail: String,
    description: String,
    deletedAt: Date,
    deleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: "active"
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    keyword: {
        type: String,
        slug: "title",
        unique: true
    },
}, {
    timestamps: true
});
const JobCategories = mongoose_1.default.model("JobCategories", jobCategoriesSchema, "jobs-categories");
exports.default = JobCategories;
