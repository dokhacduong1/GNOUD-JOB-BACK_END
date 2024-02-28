import {Router } from "express";
import * as controller from "../../controllers/clients/jobs.controller";

const router : Router = Router();
router.get("/",controller.index)
router.get("/advanced-search",controller.advancedSearch)
router.post("/may-be-interested",controller.mayBeInterested)
router.get("/search-job/:slug",controller.jobSearch)
router.post("/job-by-categories",controller.jobsByCategories)
router.get("/search-position", controller.jobSearchPosition);
export const jobRoutes : Router  = router