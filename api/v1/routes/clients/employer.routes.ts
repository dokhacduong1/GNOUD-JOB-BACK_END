import {Router } from "express";
import * as controller from "../../controllers/clients/employers.controller";

const router : Router = Router();
router.get("/",controller.index)

export const employerRoutes : Router  = router