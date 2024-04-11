import { Socket } from "socket.io";
import User from "../../../models/user.model";
import Employer from "../../../models/employers.model";
// Hàm tìm kiếm user hoặc employer từ token
const findUserOrEmployer = async (token: string, role: string) => {
  enum Role {
    CLIENT = "client",
    EMPLOYER = "employer",
  }
  // Tìm user từ token
  if (role === Role.CLIENT) {
    const user = await User.findOne({ token }).select("-password -token");
    return user;
  }

  if (role === Role.EMPLOYER) {
    // Nếu không tìm thấy user, tìm employer từ token
    const employer = await Employer.findOne({ token }).select(
      "-password -token"
    );
    return employer;
  }
  return [];
};

export const authSocket = async (io: any) => {
  // server-side
  io.use(async (socket : Socket, next : any) => {
    // Lấy token và role từ handshake
    const token: string = socket?.handshake?.auth?.token;
    const role: string = socket?.handshake?.auth?.role;
   
    // Nếu không có token hoặc role, gọi callback với lỗi
    if (!token || !role) {
        next(new Error("not authorized"));
    }

    // Tìm kiếm user hoặc employer từ token
    let user: any = await findUserOrEmployer(token, role);

    // Nếu không tìm thấy user hoặc employer, gọi callback với lỗi
    if (!user) {
        next(new Error("not authorized"));
    }

    // Lưu user vào socket
    socket["user"] = user;
    next();
  });
};
