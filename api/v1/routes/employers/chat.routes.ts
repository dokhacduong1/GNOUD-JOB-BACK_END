import { Router } from "express";
import * as controller from "../../controllers/employers/chat.controller";
import * as validate from "../../validates/employers/chat.validate";
const router: Router = Router();

router.get("/get-content-chat/:idUser",validate.getContentChat ,controller.getContentChat);

router.get("/get-history-chat",validate.getHistoryChat ,controller.getHistoryChat);

export const chatRoutes: Router = router;
