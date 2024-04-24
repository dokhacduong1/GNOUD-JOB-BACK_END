import { Router } from "express";
import * as controller from "../../controllers/clients/cv.controller";
import * as validate from "../../validates/clients/cvs.validate";
const router: Router = Router();


router.get("/get-cv-info-user/:idUser", validate.getCvInfoUser,controller.getCvInfoUser);

export const cvRoutes: Router = router;
