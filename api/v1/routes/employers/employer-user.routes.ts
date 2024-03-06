import { Router } from "express";
//Xíu phải tạo file Control mới có file controller này
import * as controller from "../../controllers/employers/employer-user.controller";
import * as validates from "../../validates/employers/employers-user.validate"
import * as uploadDriver from "../../middlewares/admins/uploadDriver.middleware"
import * as authMiddlewares from "../../middlewares/employers/auth.middleware"
const router : Router = Router();

router.post('/register',validates.register,controller.register )
router.post('/login',validates.login,controller.login )
router.post('/password/forgot',validates.forgotPassword,controller.forgotPassword)
router.post('/password/check-token',validates.checkToken,controller.checkToken)
router.post('/password/reset',validates.resetPassword,controller.resetPassword)


router.post('/upload-avatar',authMiddlewares.auth,uploadDriver.uplloadReact,controller.uploadAvatar)
router.post('/change-info-employer',authMiddlewares.auth,validates.changeInfoUser,controller.changeInfoEmployer)
router.post('/verify-password',authMiddlewares.auth,validates.verifyPassword,controller.verifyPassword)

router.post('/send-sms',authMiddlewares.auth,validates.sendEms,controller.sendEms)
router.post('/verify-code-sms',authMiddlewares.auth,validates.verifyCodeSms,controller.verifyCodeSms)
router.post('/authen',validates.authen,controller.authen)
export const employerUserRoutes : Router  = router