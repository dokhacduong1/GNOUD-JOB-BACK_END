import User from "../../../../models/user.model";
import { Request, Response } from "express";
export const auth =async function (req: Request, res: Response,next : any): Promise<void> {
    //Check xem req.header.authorization có tồn tại hay không
    //req.headers.authorizatio: Là một trong các token được gửi đi bởi headers có tác dụng gửi token từ headers qua không phải từ req.body qua
    //Ở đây sẽ check dạng token là Bearer Token vd: Bearer 242f40bab0ed22176cc1520e837e17b8d203b4dd08b504d7d22f0dd95dbf0.22415214138912876
    if (req.headers.authorization) {
        //Đoạn này thấy điểm chung của token là khoảng trắng ta cắt khoảng trắng lấy vị trí mảng số 1 sẽ lấy được token
        const token : string = req.headers.authorization.split(" ")[1]
        //Lấy token vừa tìm được check xem trong database có dữ liệu không nếu có thì không lấy ra password với token
        const user = await User.findOne({
            token: token
        }).select("-password -token");
        //Nếu token không khớp databse trả ra dữ liệu người dùng không hợp lệ
        if (!user) {
             res.status(402).json({ error: "Dữ Liệu Người Dùng Không Hợp Lệ!",code:402 });
             return;
        }
        //Nếu có lưu user vừa tìm được vào req.user
        req["user"] = user
     
        //Xong cho next
        next();
    } else {
         res.status(401).json({ error: "Bạn Không Có Quyền Truy Cập!" });
         return;
    }
}