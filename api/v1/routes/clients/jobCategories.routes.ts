import { Router } from "express";
import * as controller from "../../controllers/clients/jobsCategories.controller";

const router: Router = Router();

router.get("/", controller.index)

//Lấy ra số lượng công việc từng danh mục 
router.get("/count-job",
    controller.countJobs)



export const jobCategoriesRoutes: Router = router