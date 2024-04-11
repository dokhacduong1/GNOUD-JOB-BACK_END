import { Router } from "express";
import * as controller from "../../controllers/employers/cv.controller";

const router: Router = Router();

router.get("/get-cv-apply", controller.getCvApply);
router.get("/get-cv-apply-accept", controller.getCvApplyAccept);


export const cvRoutes: Router = router;
