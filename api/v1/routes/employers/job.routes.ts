import { Router } from "express";
import * as controller from "../../controllers/employers/jobs.controller";
import * as validates from "../../validates/employers/jobs.validate";
const router: Router = Router();
router.get("/", controller.index);
//Tạo mới dữ liệu
router.post("/create", validates.createRecord, controller.create);

router.get("/info-job/:id", controller.infoJob);
router.post("/get-pdf",validates.getPdfToDriver, controller.getPdfToDriver);

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
router.post("/action-cv",validates.actionCv, controller.actionCv);
router.post("/count-view-cv", controller.coutViewCv);
router.post("/user-preview-job",validates.userPreviewJob, controller.userPreviewJob);
router.post("/buy-user-preview-job",validates.buyUserPreviewJob, controller.buyUserPreviewJob);
router.post("/info-user-profile", controller.infoUserProfile);
router.post("/follow-user-profile",validates.followUserProfile, controller.followUserProfile);
router.post("/delete-follow-profile",validates.deleteFollowProfile, controller.deleteFollowProfile);
router.post("/follow-user-job", controller.followUserJob);
export const jobRoutes: Router = router;
