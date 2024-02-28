import {Router } from "express";
import * as controller from "../../controllers/clients/employers.controller";

const router : Router = Router();
router.get("/",controller.index)
router.get("/count-job",controller.coutJobs)
export const employerRoutes : Router  = router