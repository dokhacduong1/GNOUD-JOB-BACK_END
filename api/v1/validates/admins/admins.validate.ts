

import { Request, Response } from "express";
//Hàm này kiểm tra Password
function validatePassword(password : string) : boolean {
    // Ít nhất 8 ký tự
    if (password.length < 8) {
        return false;
    }

    // Ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(password)) {
        return false;
    }



    // Ít nhất một ký tự đặc biệt
    if (!/[$@$!%*?&.]/.test(password)) {
        return false;
    }

    // Mật khẩu hợp lệ nếu vượt qua tất cả các điều kiện
    return true;
}
//Hàm này kiểm tra Email
function validateEmail(email : string) : boolean {
    // Biểu thức chính quy kiểm tra địa chỉ email
    const emailRegex : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra xem địa chỉ email đáp ứng biểu thức chính quy hay không
    return emailRegex.test(email);
}

export const login = async function (req: Request, res: Response,next : any): Promise<void> {

    //Kiểm tra xem người dùng nhập email đúng hay không
    if (!validateEmail(req.body.email)) {
         res.status(401).json({ error: "Email Không Hợp Lệ" });
         return;
    }

    //Kiểm tra xem người dùng nhập email hay chưa
    if (!req.body.password) {
         res.status(401).json({ error: "Vui Lòng Nhập Mật Khẩu!" });
         return;
    }
    //Nếu thỏa mãn hết điều kiện thì cho next
    next()
}

export const authen = async function (req: Request, res: Response,next : any): Promise<void> {
    //Kiểm tra xem người dùng nhập email hay chưa
    if (!req.body.token) {
         res.status(401).json({ error: "Vui Lòng Nhập Token!" });
         return;
    }
    //Nếu thỏa mãn hết điều kiện thì cho next
    next()
}