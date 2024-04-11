import { Router } from "express";
import * as controller from "../../controllers/clients/chat.controller";

const router: Router = Router();

router.get("/private/:userId/:roomChatId", controller.chatPrivate);



export const chatRoutes: Router = router;
