import { Router } from "express";
import * as controller from "../../controllers/admins/jobsCategories.controller";
import * as validates from "../../validates/admins/jobsCategories.validate"
import multer from "multer"
import * as uploadCloud from "../../middlewares/admins/uploadCloud.middleware"
import * as middleware from "../../middlewares/admins/auth.middleware"
const router: Router = Router();

router.get("/", controller.index)
//Tạo mới dữ liệu
router.post("/create",
    validates.createRecord,
    uploadCloud.uplloadReact,
    controller.create)
//Thay đổi trạng thái dữ liệu
router.patch("/change-status/:id",
    validates.editStatus,
    controller.changeStatus);

router.patch("/change-multi",
    controller.changeMulti);

router.patch("/edit/:id",
    validates.edit,
    validates.editStatus,
    uploadCloud.uplloadReact,
    controller.edit);

//Xóa mềm dữ liệu
router.delete("/delete/:id",
    controller.deleteCategories);


//Tạo một cây phân cấp
router.get("/tree", 
    controller.tree)

export const jobCategoriesRoutes: Router = router