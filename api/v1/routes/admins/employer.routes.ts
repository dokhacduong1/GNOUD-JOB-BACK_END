import {Router } from "express";
import * as controller from "../../controllers/admins/employers.controller";
import * as validates from "../../validates/admins/employers.validate"
const router : Router = Router();
router.get("/",controller.index)
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:id",validates.editStatus, controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.post("/create",validates.create, controller.create);
router.patch("/edit/:id",validates.edit, controller.edit);
router.delete("/delete/:id", controller.deleteTask);
export const employerRoutes : Router  = router