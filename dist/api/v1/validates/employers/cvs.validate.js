"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCvInfoUser = void 0;
const rooms_chat_model_1 = __importDefault(require("../../../../models/rooms-chat.model"));
const getCvInfoUser = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employerId = req["user"]._id.toString();
            const idUser = req.params.idUser;
            if (employerId === idUser) {
                res
                    .status(400)
                    .json({ error: "Không thể xem thông tin của chính mình." });
                return;
            }
            if (!idUser ||
                !employerId ||
                idUser === "undefined" ||
                employerId === "undefined") {
                res.status(400).json({ error: "Thiếu thông tin." });
                return;
            }
            const exitedRoomChatGroup = yield rooms_chat_model_1.default.findOne({
                _id: idUser,
                "users.employer_id": employerId,
            });
            if (exitedRoomChatGroup) {
                req["infoRoom"] = exitedRoomChatGroup;
                next();
                return;
            }
            const exitedRoomChat = yield rooms_chat_model_1.default.findOne({
                "users.user_id": idUser,
                "users.employer_id": employerId,
            });
            if (!exitedRoomChat) {
                res.status(400).json({ error: "Không được quyền truy cập thông tin." });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getCvInfoUser = getCvInfoUser;
