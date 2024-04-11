"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomChatSchema = new mongoose_1.default.Schema({
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            role: String,
        },
    ],
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const RoomChat = mongoose_1.default.model("RoomChat", roomChatSchema, "rooms-chat");
exports.default = RoomChat;
