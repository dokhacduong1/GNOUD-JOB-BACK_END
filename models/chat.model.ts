import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    role: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema, "chats");

export default Chat;
