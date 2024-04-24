"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomChatSchema = new mongoose_1.default.Schema({
    title: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            employer_id: String,
            id_check: String,
            role: String,
        },
    ],
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dmmz10szo/image/upload/v1710149283/GNOUD_2_pxldrg.png"
    },
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
