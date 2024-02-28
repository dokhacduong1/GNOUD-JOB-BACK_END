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
const upload_routes_1 = require("./upload.routes");
const admins_user_routes_1 = require("./admins-user.routes");
const roles_routes_1 = require("./roles.routes");
const middleware = __importStar(require("../../middlewares/admins/auth.middleware"));
const routesAdminVersion1 = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/employers", employer_routes_1.employerRoutes);
    app.use(version + "/jobs", middleware.auth, job_routes_1.jobRoutes);
    app.use(version + "/job-categories", middleware.auth, jobCategories_routes_1.jobCategoriesRoutes);
    app.use(version + "/admins", admins_user_routes_1.adminRoutes);
    app.use(version + "/uploads", upload_routes_1.uploadRoutes);
    app.use(version + "/roles", middleware.auth, roles_routes_1.roleRoutes);
};
exports.default = routesAdminVersion1;
