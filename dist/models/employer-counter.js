"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employerCounterSchema = new mongoose_1.default.Schema({
    count: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const EmployerCounter = mongoose_1.default.model("EmployerCounter", employerCounterSchema, "employer-counter");
exports.default = EmployerCounter;
