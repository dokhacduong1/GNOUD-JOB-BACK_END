"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cvSchema = new mongoose_1.default.Schema({
    email: String,
    fulName: String,
    phone: String,
    id_file_cv: String,
    introducing_letter: String,
    dateTime: Date,
    idUser: String,
    status: String,
    idJob: String,
    employerId: String,
    countView: {
        type: Number,
        default: 0
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const Cv = mongoose_1.default.model("Cv", cvSchema, "cvs");
exports.default = Cv;
