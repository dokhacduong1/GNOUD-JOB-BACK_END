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
exports.jobRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/clients/jobs.controller"));
const validates = __importStar(require("../../validates/clients/job.validate"));
const authMiddlewares = __importStar(require("../../middlewares/clients/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", controller.index);
router.get("/advanced-search", controller.advancedSearch);
router.post("/may-be-interested", controller.mayBeInterested);
router.get("/search-job/:slug", controller.jobSearch);
router.get("/job-by-company/:slug", controller.jobByCompany);
router.post("/job-by-categories", controller.jobsByCategories);
router.get("/search-position", controller.jobSearchPosition);
router.post("/get-pdf", authMiddlewares.auth, validates.getPdfToDriver, controller.getPdfToDriver);
router.get("/job-apply", authMiddlewares.auth, controller.jobApply);
router.get("/job-save", authMiddlewares.auth, controller.jobSave);
router.post("/user-view-job", validates.userViewJob, controller.userViewJob);
exports.jobRoutes = router;
