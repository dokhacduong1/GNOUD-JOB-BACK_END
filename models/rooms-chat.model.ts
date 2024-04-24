import mongoose from "mongoose";

const roomChatSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

export default RoomChat;
