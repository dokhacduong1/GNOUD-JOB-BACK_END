
import { Request, Response } from "express";
import Admin from "../../../../models/admins.model";
import { POPULATE } from "../../interfaces/populate.interface";
import Role from "../../../../models/roles.model";
export const auth = async function (req: Request, res: Response, next: any): Promise<void> {
    //Check xem req.header.authorization có tồn tại hay không
    //req.headers.authorizatio: Là một trong các token được gửi đi bởi headers có tác dụng gửi token từ headers qua không phải từ req.body qua
    //Ở đây sẽ check dạng token là Bearer Token vd: Bearer 242f40bab0ed22176cc1520e837e17b8d203b4dd08b504d7d22f0dd95dbf0.22415214138912876

    try {
        if (req.headers) {
            
            //Đoạn này thấy điểm chung của token là khoảng trắng ta cắt khoảng trắng lấy vị trí mảng số 1 sẽ lấy được token
            const token: string = req.headers.authorization.split(" ")[1]
            //Tạo một mảng POPULATE có định dạng mặc định như dưới 
            const populateCheck: POPULATE[] = [
                {
                    path: "role_id",
                    select: "title description permissions",
                    model: Role
                },
            ];
            //Lấy token vừa tìm được check xem trong database có dữ liệu không nếu có thì không lấy ra password với token
            const userAdmin = await Admin.findOne({
                token: token
            }).select("-password -token").populate(populateCheck);
            //Nếu token không khớp databse trả ra dữ liệu người dùng không hợp lệ
            if (!userAdmin) {
                res.status(401).json({ error: "Dữ Liệu Người Dùng Không Hợp Lệ Vui Lòng Tải Lại Trang!" });
                return;
            }
            
            const recordNew = {
                id: userAdmin._id,
                title: userAdmin.title,
                avatar: userAdmin.avatar,
                email: userAdmin.email,
                role_id: userAdmin.role_id["_id"],
                role_title: userAdmin.role_id["title"],
                role_description: userAdmin.role_id["description"],
                permissions: userAdmin.role_id["permissions"],
            }

            //Nếu có lưu user vừa tìm được vào req.user
            req["userAdmin"] = recordNew
        
            //Xong cho next
            next();
        } else {
            res.status(401).json({ error: "Bạn Không Có Quyền Truy Cập!" });
            return;
        }
    } catch (error) {
        //Thông báo lỗi 500 đến người dùng server lỗi.
        console.error("Error in API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}