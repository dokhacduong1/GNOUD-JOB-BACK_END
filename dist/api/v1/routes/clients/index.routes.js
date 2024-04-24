"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const employer_routes_1 = require("./employer.routes");
const job_routes_1 = require("./job.routes");
const jobCategories_routes_1 = require("./jobCategories.routes");
const user_user_routes_1 = require("./user-user.routes");
const skill_routes_1 = require("./skill.routes");
const authMiddlewares = __importStar(require("../../middlewares/clients/auth.middleware"));
const chat_routes_1 = require("./chat.routes");
const cv_routes_1 = require("./cv.routes");
const routesClientVersion1 = (app) => {
    const version = "/api/v1/client";
    app.use(version + "/employers", employer_routes_1.employerRoutes);
    app.use(version + "/users", user_user_routes_1.usersRoutes);
    app.use(version + "/jobs", job_routes_1.jobRoutes);
    app.use(version + "/job-categories", jobCategories_routes_1.jobCategoriesRoutes);
    app.use(version + "/skill", skill_routes_1.skillRoutes);
    app.use(version + "/chat", authMiddlewares.auth, chat_routes_1.chatRoutes);
    app.use(version + "/cvs", authMiddlewares.auth, cv_routes_1.cvRoutes);
};
exports.default = routesClientVersion1;
