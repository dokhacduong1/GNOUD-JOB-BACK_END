import {Router } from "express";
import * as controller from "../../controllers/clients/jobs.controller";

const router : Router = Router();
router.get("/",controller.index)

export const jobRoutes : Router  = router