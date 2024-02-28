import { Router } from "express";
import * as controller from "../../controllers/admins/jobs.controller";
import * as validates from "../../validates/admins/jobs.validate";
const router: Router = Router();
router.get("/", controller.index);
//Tạo mới dữ liệu
router.post("/create", validates.createRecord, controller.create);

router.patch("/edit/:id",
    validates.editRecord,
    controller.edit);
//Thay đổi trạng thái dữ liệu
router.patch(
  "/change-status/:id",
  validates.editStatus,
  controller.changeStatus
);
router.patch("/change-multi", controller.changeMulti);
//Xóa mềm dữ liệu
router.delete("/delete/:id", controller.deleteJobs);

export const jobRoutes: Router = router;
