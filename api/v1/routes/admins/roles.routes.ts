import { Router } from "express";
import * as controller from "../../controllers/admins/roles.controller";
import * as validates from "../../validates/admins/roles.validates"
import * as middleware from "../../middlewares/admins/auth.middleware"
const router: Router = Router();
router.get("/", controller.index)
//Tạo mới dữ liệu
router.post("/create",
    validates.createRecord,
    controller.create)

router.patch("/edit/:id",
    validates.edit,
    controller.edit);

router.patch("/edit-permissions/:id",
    validates.editPermissions,
    controller.editPermissions);

//Xóa mềm dữ liệu
router.delete("/delete/:id",
    controller.deleteRoles);

router.patch("/change-multi",
    controller.changeMulti);
router.get("/info",
    controller.info);
export const roleRoutes: Router = router