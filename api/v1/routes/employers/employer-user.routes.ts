import { Router } from "express";
//Xíu phải tạo file Control mới có file controller này
import * as controller from "../../controllers/employers/employer-user.controller";
import * as validates from "../../validates/employers/employers-user.validate"
const router : Router = Router();

router.post('/register',validates.register,controller.register )
router.post('/login',validates.login,controller.login )
router.post('/password/forgot',validates.forgotPassword,controller.forgotPassword)
router.post('/password/check-token',validates.checkToken,controller.checkToken)
router.post('/password/reset',validates.resetPassword,controller.resetPassword)



router.post('/authen',validates.authen,controller.authen)
export const employerUserRoutes : Router  = router