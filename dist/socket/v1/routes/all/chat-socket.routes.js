"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.chatSocketRouter = void 0;
const controller = __importStar(require("../../controllers/chat-socket.controller"));
const rooms_chat_model_1 = __importDefault(require("../../../../models/rooms-chat.model"));
const chat_model_1 = __importDefault(require("../../../../models/chat.model"));
const chatSocketRouter = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { idUser = "" } = ((_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) || {};
    const userMain = (_b = socket["user"]) === null || _b === void 0 ? void 0 : _b._id.toString();
    if (!userMain || !idUser || userMain === idUser)
        return;
    const typeRoom = yield getTypeRoom(idUser);
    const roomChat = yield getRoomChat(userMain, idUser, typeRoom);
    if (!roomChat)
        return;
    const roomChatId = roomChat["_id"].toString();
    socket["roomChat"] = roomChatId;
    socket.join(roomChatId);
    yield updateUnreadMessages(roomChatId, idUser);
    io.to(roomChatId).emit("SERVER_RETURN_REQUEST_ONLINE", {
        user_id: userMain,
        status: "online",
    });
    registerEventHandlers(socket, io, typeRoom, userMain, roomChatId);
});
exports.chatSocketRouter = chatSocketRouter;
const getTypeRoom = (idUser) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield rooms_chat_model_1.default.findOne({ _id: idUser, typeRoom: "group" }).select("_id");
    return room ? "group" : "friend";
});
const getRoomChat = (userMain, idUser, typeRoom) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        "users.id_check": { $all: [userMain] },
        typeRoom: typeRoom,
    };
    if (typeRoom !== "group") {
        query["users.id_check"].$all.push(idUser);
    }
    return yield rooms_chat_model_1.default.findOne(query).select("_id");
});
const updateUnreadMessages = (roomChatId, idUser) => __awaiter(void 0, void 0, void 0, function* () {
    const chatQuery = {
        room_chat_id: roomChatId,
        user_id: idUser,
        read: false,
    };
    if ((yield chat_model_1.default.countDocuments(chatQuery)) > 0) {
        yield chat_model_1.default.updateMany(chatQuery, { $set: { read: true } });
    }
});
const registerEventHandlers = (socket, io, typeRoom, idUser, roomChatId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeRoom === "group" && (yield rooms_chat_model_1.default.findOne({ _id: roomChatId, "users.employer_id": idUser, typeRoom: "group" }))) {
        socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
    }
    if (typeRoom === "friend") {
        socket.on("CLIENT_SEND_MESSAGE", controller.chatSocket(socket, io));
    }
    socket.on("CLIENT_SEND_REQUEST_SEEN_CHAT", controller.requestSeenChat(socket, io));
    socket.on("CLIENT_SEND_TYPING", controller.sendTyping(socket, io));
    socket.on("disconnect", controller.disconnectChatSocket(socket, io));
});
