import { Router } from "express";
import * as controller from "../../controllers/employers/cv.controller";
import * as validate from "../../validates/employers/cvs.validate";
const router: Router = Router();

router.get("/get-cv-apply", controller.getCvApply);
router.get("/get-cv-apply-accept", controller.getCvApplyAccept);
router.get("/get-cv-info-user/:idUser", validate.getCvInfoUser,controller.getCvInfoUser);

export const cvRoutes: Router = router;
