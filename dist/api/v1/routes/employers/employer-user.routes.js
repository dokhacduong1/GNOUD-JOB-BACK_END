"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employerUserRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/employers/employer-user.controller"));
const validates = __importStar(require("../../validates/employers/employers-user.validate"));
const uploadDriver = __importStar(require("../../middlewares/admins/uploadDriver.middleware"));
const authMiddlewares = __importStar(require("../../middlewares/employers/auth.middleware"));
const router = (0, express_1.Router)();
router.post('/register', validates.register, controller.register);
router.post('/login', validates.login, controller.login);
router.post('/password/forgot', validates.forgotPassword, controller.forgotPassword);
router.post('/password/check-token', validates.checkToken, controller.checkToken);
router.post('/password/reset', validates.resetPassword, controller.resetPassword);
router.post('/upload-avatar', authMiddlewares.auth, uploadDriver.uplloadReact, controller.uploadAvatar);
router.post('/change-info-employer', authMiddlewares.auth, validates.changeInfoUser, controller.changeInfoEmployer);
router.post('/change-info-company', authMiddlewares.auth, validates.changeInfoCompany, uploadDriver.uplloadReact, controller.changeInfoCompany);
router.get('/statistic-company', authMiddlewares.auth, controller.statisticCompany);
router.post('/change-password', authMiddlewares.auth, validates.changePassword, controller.changePasswordEmployer);
router.post('/verify-password', authMiddlewares.auth, validates.verifyPassword, controller.verifyPassword);
router.post('/send-sms', authMiddlewares.auth, validates.sendEms, controller.sendEms);
router.post('/verify-code-sms', authMiddlewares.auth, validates.verifyCodeSms, controller.verifyCodeSms);
router.post('/authen', validates.authen, controller.authen);
exports.employerUserRoutes = router;
