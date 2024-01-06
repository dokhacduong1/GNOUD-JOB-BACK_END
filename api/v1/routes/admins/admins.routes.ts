import { Router } from "express";
import * as controller from "../../controllers/admins/admins.controller";
import * as validates from "../../validates/admins/admins.validate"
import * as middleware from "../../middlewares/admins/auth.middleware"
const router: Router = Router();

router.get("/", controller.index)
router.post("/login",validates.login,controller.login)
router.post("/authen",validates.authen,controller.authen)
router.post("/info",middleware.auth,controller.info)
export const adminRoutes: Router = router