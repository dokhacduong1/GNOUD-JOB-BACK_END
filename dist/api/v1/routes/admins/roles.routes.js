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
exports.roleRoutes = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/admins/roles.controller"));
const validates = __importStar(require("../../validates/admins/roles.validates"));
const router = (0, express_1.Router)();
router.get("/", controller.index);
router.post("/create", validates.createRecord, controller.create);
router.patch("/edit/:id", validates.edit, controller.edit);
router.patch("/edit-permissions/:id", validates.editPermissions, controller.editPermissions);
router.delete("/delete/:id", controller.deleteRoles);
router.patch("/change-multi", controller.changeMulti);
router.get("/info", controller.info);
exports.roleRoutes = router;
