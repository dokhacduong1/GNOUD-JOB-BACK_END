import {Router } from "express";
import * as controller from "../../controllers/clients/jobs.controller";
import * as validates from "../../validates/clients/job.validate"
import * as authMiddlewares from "../../middlewares/clients/auth.middleware"
const router : Router = Router();
router.get("/",controller.index)
router.get("/advanced-search",controller.advancedSearch)
router.post("/may-be-interested",controller.mayBeInterested)
router.get("/search-job/:slug",controller.jobSearch)
router.get("/job-by-company/:slug",controller.jobByCompany)
router.post("/job-by-categories",controller.jobsByCategories)
router.get("/search-position", controller.jobSearchPosition);
router.post("/get-pdf",authMiddlewares.auth,validates.getPdfToDriver, controller.getPdfToDriver);
router.get("/job-apply",authMiddlewares.auth, controller.jobApply);
router.get("/job-save",authMiddlewares.auth, controller.jobSave);
router.post("/user-view-job",validates.userViewJob,controller.userViewJob)
export const jobRoutes : Router  = router