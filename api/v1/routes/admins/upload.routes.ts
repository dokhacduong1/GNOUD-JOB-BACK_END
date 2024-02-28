import { Router } from "express";
import * as controller from "../../controllers/admins/upload.controller";
import multer from "multer"
import * as uploadCloud from "../../middlewares/admins/uploadCloud.middleware"
import * as uploadDriver from "../../middlewares/admins/uploadDriver.middleware"
const upload = multer()
const router: Router = Router();

router.post("/image",
    upload.single("file"),
    uploadDriver.uplloadTiny,
    controller.image)

export const uploadRoutes: Router = router