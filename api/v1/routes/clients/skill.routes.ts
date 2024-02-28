import { Router } from "express";
import * as controller from "../../controllers/clients/skills.controller";

const router: Router = Router();

router.get("/", controller.index);



export const skillRoutes: Router = router;
