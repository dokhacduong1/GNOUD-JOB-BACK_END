import { Router } from "express";
//Xíu phải tạo file Control mới có file controller này
import * as controller from "../../controllers/clients/users-user.controller";
import * as validates from "../../validates/clients/users.validate"
import * as authMiddlewares from "../../middlewares/clients/auth.middleware"
import * as uploadDriver from "../../middlewares/admins/uploadDriver.middleware"
const router : Router = Router();

router.post('/register',validates.register,controller.register )
router.post('/login',validates.login,controller.login)
router.post('/password/forgot',validates.forgotPassword,controller.forgotPassword)
router.post('/password/check-token',validates.checkToken,controller.checkToken)
router.post('/password/reset',validates.resetPassword,controller.resetPassword)

router.post('/detail',authMiddlewares.auth,controller.detail)
router.post('/list',authMiddlewares.auth,controller.list)
router.post('/change-password',authMiddlewares.auth,validates.changePassword,controller.changePassword)
router.post('/change-info-user',authMiddlewares.auth,validates.changeInfoUser,controller.changeInfoUser)
router.post('/recruitment-job',authMiddlewares.auth,validates.recruitmentJob,uploadDriver.uplloadReactPdf,controller.recruitmentJob)

router.post('/change-job-suggestions',authMiddlewares.auth,validates.changeJobSuggestions,controller.changeJobSuggestions)
router.post('/change-email-suggestions',authMiddlewares.auth,validates.changeEmailSuggestions,controller.changeEmailSuggestions)

router.post('/authen',validates.authen,controller.authen)
router.post('/allow-setting-user',authMiddlewares.auth,validates.allowSettingUser,controller.allowSettingUser)
router.post('/upload-avatar',authMiddlewares.auth,uploadDriver.uplloadReact,controller.uploadAvatar)
router.post('/upload-cv',authMiddlewares.auth,validates.uploadCv,uploadDriver.uplloadReactPdf,controller.uploadCv)
router.get('/get-cv-user',authMiddlewares.auth,controller.getCvByUser)
router.post('/edit-cv-user',authMiddlewares.auth,validates.editCvByUser,controller.editCvByUser)
export const usersRoutes : Router  = router