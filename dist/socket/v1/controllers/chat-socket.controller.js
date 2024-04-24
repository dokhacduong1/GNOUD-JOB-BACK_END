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
exports.sendTyping = exports.requestSeenChat = exports.disconnectChatSocket = exports.chatSocket = void 0;
const chat_model_1 = __importDefault(require("../../../models/chat.model"));
const employers_model_1 = __importDefault(require("../../../models/employers.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const rooms_chat_model_1 = __importDefault(require("../../../models/rooms-chat.model"));
const chatSocket = (socket, io) => {
    return (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const objectSend = {
            fullName: socket["user"].fullName,
            content: msg,
            user_id: socket["user"]._id,
            avatar: ((_a = socket["user"]) === null || _a === void 0 ? void 0 : _a.avatar) || ((_b = socket["user"]) === null || _b === void 0 ? void 0 : _b.logoCompany) || "",
        };
        const record = {
            user_id: socket["user"]._id,
            room_chat_id: socket["roomChat"],
            content: msg,
            images: [],
        };
        const chat = new chat_model_1.default(record);
        yield chat.save();
        io.to(socket["roomChat"]).emit("SERVER_RETURN_MESSAGE", objectSend);
        io.emit("SERVER_RETURN_REQUEST_LOADMORE", {
            id_check: socket["user"]._id,
        });
    });
};
exports.chatSocket = chatSocket;
const disconnectChatSocket = (socket, io) => {
    return (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const idUser = socket["user"]._id;
        let Role;
        (function (Role) {
            Role["EMPLOYER"] = "employer";
            Role["USER"] = "client";
        })(Role || (Role = {}));
        const role = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.role;
        switch (role) {
            case Role.EMPLOYER:
                yield employers_model_1.default.updateOne({ _id: idUser }, { statusOnline: false });
                break;
            case Role.USER:
                yield user_model_1.default.updateOne({ _id: idUser }, { statusOnline: false });
                break;
        }
        const roomChat = socket["roomChat"];
        if (!idUser || !roomChat)
            return;
        socket.leave(roomChat);
        io.to(roomChat).emit("SERVER_RETURN_REQUEST_OFFLINE", {
            user_id: idUser,
            status: "offline",
        });
    });
};
exports.disconnectChatSocket = disconnectChatSocket;
const requestSeenChat = (socket, io) => {
    return (data) => __awaiter(void 0, void 0, void 0, function* () {
        const idUser = data["idUser"];
        const idCheck = data["idCheck"];
        if (idUser === idCheck) {
            yield chat_model_1.default.updateMany({ user_id: idUser, room_chat_id: socket["roomChat"], read: false }, { read: true });
        }
        const exitedRoomChat = yield rooms_chat_model_1.default.findOne({
            _id: idUser,
            typeRoom: "group",
        });
        if (exitedRoomChat) {
            yield chat_model_1.default.updateMany({ user_id: idCheck, room_chat_id: idUser, read: false }, { read: true });
        }
    });
};
exports.requestSeenChat = requestSeenChat;
const sendTyping = (socket, io) => {
    return (idUser) => __awaiter(void 0, void 0, void 0, function* () {
        const record = {
            user_id: socket["user"]._id,
            room_chat_id: socket["roomChat"],
        };
        socket.broadcast
            .to(socket["roomChat"])
            .emit("SERVER_RETURN_TYPING", record);
    });
};
exports.sendTyping = sendTyping;
