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
exports.getHistoryChat = exports.getContentChat = void 0;
const chat_model_1 = __importDefault(require("../../../../models/chat.model"));
const employers_model_1 = __importDefault(require("../../../../models/employers.model"));
const rooms_chat_model_1 = __importDefault(require("../../../../models/rooms-chat.model"));
const getContentChat = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const populate = [
                {
                    path: "user_id",
                    select: "email phone fullName logoCompany image",
                    model: employers_model_1.default,
                },
                {
                    path: "room_chat_id",
                    select: "typeRoom",
                    model: rooms_chat_model_1.default,
                },
            ];
            const record = yield chat_model_1.default.find({ room_chat_id: req["roomChat"] })
                .populate(populate)
                .select("content user_id")
                .lean();
            let typeRoom = "friend";
            const roomExist = yield rooms_chat_model_1.default.findOne({ _id: req["roomChat"] });
            if (record.length === 0 && roomExist) {
                typeRoom = "group";
            }
            const convertData = record.map((item) => {
                if (item.room_chat_id["typeRoom"] === "group") {
                    typeRoom = "group";
                }
                return {
                    content: item.content,
                    user_id: item.user_id ? item.user_id["_id"] : req["user"]._id,
                    avatar: item.user_id ? item.room_chat_id["typeRoom"] === "group" ? item.user_id["logoCompany"] : item.user_id["image"] : req["user"].avatar,
                };
            });
            res.status(200).json({ data: convertData, typeRoom, code: 200 });
        }
        catch (error) {
            console.error("Lỗi trong API:", error);
            res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
        }
    });
};
exports.getContentChat = getContentChat;
const getHistoryChat = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const populateInfo = [
                {
                    path: "users.employer_id",
                    select: "email phone fullName logoCompany image",
                    model: employers_model_1.default,
                },
            ];
            const [rooms, chats, unreadCounts] = yield Promise.all([
                rooms_chat_model_1.default.find({ _id: { $in: req["listIdRoomChat"] } }).populate(populateInfo),
                chat_model_1.default.aggregate([
                    { $match: { room_chat_id: { $in: req["listIdRoomChat"] } } },
                    { $sort: { room_chat_id: 1, createdAt: -1 } },
                    {
                        $group: {
                            _id: "$room_chat_id",
                            lastMessage: { $first: "$content" },
                            idUserChat: { $first: "$user_id" },
                        },
                    },
                ]),
                chat_model_1.default.aggregate([
                    {
                        $match: {
                            room_chat_id: { $in: req["listIdRoomChat"] },
                            read: false,
                            user_id: { $ne: req["user"]._id.toString() },
                        },
                    },
                    {
                        $group: {
                            _id: "$room_chat_id",
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const data = rooms.map((room) => {
                var _a, _b, _c;
                const chatAll = chats.find((item) => item._id.toString() === (room === null || room === void 0 ? void 0 : room._id.toString()));
                if (room.typeRoom === "group") {
                    return {
                        typeRoom: "group",
                        room_chat_id: room._id || "",
                        avatar: room.avatar || "",
                        fullName: room.title || "",
                        user_id: room._id,
                        lastMessage: chats ? (chatAll === null || chatAll === void 0 ? void 0 : chatAll.lastMessage) || "" : "",
                        idUserChat: chats ? (chatAll === null || chatAll === void 0 ? void 0 : chatAll.idUserChat) || "" : "",
                        unreadCount: ((_a = unreadCounts[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                    };
                }
                const unreadCount = ((_b = unreadCounts.find((item) => item._id.toString() === room._id.toString())) === null || _b === void 0 ? void 0 : _b.count) || 0;
                const findIndexEmployer = room.users.findIndex((item) => item.employer_id);
                const user = ((_c = room.users[findIndexEmployer]) === null || _c === void 0 ? void 0 : _c.employer_id) || {};
                return {
                    typeRoom: "friend",
                    room_chat_id: room._id,
                    user_id: user["_id"],
                    fullName: user["fullName"],
                    avatar: user["image"],
                    phone: user["phone"],
                    email: user["email"],
                    lastMessage: chats ? (chatAll === null || chatAll === void 0 ? void 0 : chatAll.lastMessage) || "" : "",
                    idUserChat: chats ? (chatAll === null || chatAll === void 0 ? void 0 : chatAll.idUserChat) || "" : "",
                    unreadCount: unreadCount,
                };
            });
            res.status(200).json({ data: data, code: 200 });
        }
        catch (error) {
            console.error("Lỗi trong API:", error);
            res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
        }
    });
};
exports.getHistoryChat = getHistoryChat;
