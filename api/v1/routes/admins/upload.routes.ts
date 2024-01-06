import { Router } from "express";
import * as controller from "../../controllers/admins/upload.controller";
import multer from "multer"
import * as uploadCloud from "../../middlewares/admins/uploadCloud.middleware"
const upload = multer()
const router: Router = Router();

router.post("/image",
    upload.single("file"),
    uploadCloud.uplloadTiny,
    controller.image)

export const uploadRoutes: Router = router