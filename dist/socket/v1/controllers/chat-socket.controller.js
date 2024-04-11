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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = void 0;
const chatSocket = (socket, io) => {
    const roomChat = socket.handshake.auth.roomChat || "";
    return (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const objectSend = {
            fullName: socket["user"].fullName,
            content: msg,
            user_id: socket["user"]._id,
        };
        io.to(roomChat).emit("SERVER_RETURN_MESSAGE", objectSend);
    });
};
exports.chatSocket = chatSocket;
