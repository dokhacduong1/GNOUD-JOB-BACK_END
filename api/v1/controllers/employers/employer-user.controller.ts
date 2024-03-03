import { Request, Response } from "express";
import * as EmployerInterface from "../../interfaces/empoloyer.interface";
import Employer from "../../../../models/employers.model";
import md5 from "md5";
import { generateRandomString } from "../../../../helpers/generateString";
import ForgotPasswordEmployer from "../../../../models/forgot-password-employer.model";
import { sendMailEmployer } from "../../../../helpers/sendMail";
// [POST] /api/v1/clients/employer/register
export const register = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy info người dùng gửi lên xong lưu vào object infoUser
    const infoUser: EmployerInterface.Find = {
      address: req.body.address,
      companyName: req.body.companyName,
      fullName: req.body.fullName,
      gender: req.body.gender,
      level: req.body.level,
      linkedin: req.body.linkedin || "",
      password: md5(req.body.password),
      token: generateRandomString(30),
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    };
    //Lưu tài khoản vừa tạo vào database
    const userEmployer = new Employer(infoUser);
    await userEmployer.save();
    //Lưu token vừa tạo vào cookie
    const token: string = userEmployer.token;

    res
      .status(200)
      .json({ code: 200, success: "Tạo Tài Khoản Thành Công!", token: token });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/employer/login
export const login = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy email ,password người dùng gửi lên
    const email: string = req.body.email;
    const password: string = req.body.password;
    //Check xem trong databse có tồn tại email và mật khẩu có đúng hay không!
    const user = await Employer.findOne({
      email: email,
      password: md5(password),
    });
    //Nếu không đúng thì return tài khoản mật khẩu ko đúng
    if (!user) {
      res
        .status(401)
        .json({ code: 401, error: "Tài Khoản Hoặc Mật Khẩu Không Đúng!" });
      return;
    }
    //Lấy ra token lưu vào cookie
    const token: string = user.token;

    res
      .status(200)
      .json({ code: 200, success: "Đăng Nhập Thành Công!", token: token });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/employer/password/forgot
export const forgotPassword = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy Email khi người dùng gửi lên
    const email: string = req.body.email;
    //Check email này có trong database hay không
    const user = await Employer.findOne({
      email: email,
      deleted: false,
    });
    //Nếu không đúng thì return tài khoản ko đúng
    if (!user) {
      res.status(401).json({ code: 401, error: "Tài Khoản Không Đúng!" });
      return;
    }

    //Set time cho bản ghi "5" phút sẽ tự xóa
    const timeExpire: number = 4;
    const expireAtOk: Date = new Date();
    //Đoạn này setMiniutes là 5 phút cho biên expireAtOk vừa tạo
    expireAtOk.setMinutes(expireAtOk.getMinutes() + timeExpire);
    // Tạo ra một ãm OTP 6 số và Gàn hết thông tin vào objectForgotPassword
    const objectForgotPassword = {
      email: email,
      tokenReset: generateRandomString(30),
      expireAt: expireAtOk,
      timeWait: new Date(new Date().getTime() + 60),
    };

    //Xem email đã tồn tại trong database hay chưa
    const checkRecord = await ForgotPasswordEmployer.findOne({
      email: email,
    });
    //Tạo một biến otp để lưu otp
    let tokenReset: string;
    //Nếu bản ghi tồn tại và qua 60s trong validate rồi thì ta cho người dùng một otp mới,điều đơn giản chỉ là updte cái otp cũ
    if (checkRecord) {
      await ForgotPasswordEmployer.updateOne(
        {
          email: email,
        },
        objectForgotPassword
      );
      tokenReset = objectForgotPassword.tokenReset;
    } //Nếu chưa có bản ghi nào tồn tại ta tạo otp mới cho người dùng
    else {
      //Lưu vào database
      const record = new ForgotPasswordEmployer(objectForgotPassword);
      await record.save();
      tokenReset = record.tokenReset;
    }

    //Mấy đoạn dưới dài như này là html css cái form gửi otp về
    const subject: string = "Reset mật khẩu";

    //Bắt đầu gửi mail bằng hàm sendMail này
    sendMailEmployer(email, subject, tokenReset);
    res.status(200).json({
      code: 200,
      success: `Hãy kiểm tra email ${email} của bạn. Sau đó nhấn vào link trong hộp thư để đổi lại mật khẩu.`,
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/employer/password/check-token
export const checkToken = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const tokenReset: string = req.body.tokenReset;
    //Check dữ vào database dữ liệu người dùng gửi lên
    const record = await ForgotPasswordEmployer.findOne({
      tokenReset: tokenReset,
    });

    //nếu check mà record không có trong database là otp không hợp lệ
    if (!record) {
      res.status(401).json({ code: 401, error: "Otp Không Hợp Lệ!" });
      return;
    }

    res.status(200).json({ code: 200, email: record.email });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/employer/users/password/reset
export const resetPassword = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy thông tin người dùng gửi lên
    const email: string = req.body.email;
    const password: string = req.body.password;
    const accept: boolean = req.body?.accept;
    //lấy thông tin người dùng bằng token
    const user = await Employer.findOne({
      email: email,
      deleted: false,
    });
    //Nếu user không có thì in ra tài khoản không hợp lệ
    if (!user) {
      res.status(401).json({ error: "Tài Khoản Không Hợp Lệ!" });
      return;
    }
    //Nếu có accpet thì tạo một token mới
    let tokenNew: string;
    if (accept) {
      tokenNew = generateRandomString(30);

      await Employer.updateOne(
        { email: email },
        {
          password: md5(password),
          token: tokenNew,
        }
      );
    } else {
      await Employer.updateOne(
        { email: email },
        {
          password: md5(password),
        }
      );
    }
    //Xóa bản ghi trong database ForgotPassword khi đã đổi mật khẩu thành công
    await ForgotPasswordEmployer.deleteOne({ email: email });
    res.status(200).json({ code: 200, success: `Đổi Mật Khẩu Thành Công!` });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// [POST] /api/v1/employers/users/authen
export const authen = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const token : string = req.headers.authorization.split(" ")[1]
    //Tạo một mảng POPULATE có định dạng mặc định như dưới

    //Check xem trong databse có tồn tại token và mật khẩu có đúng hay không!
    const userEmployer = await Employer.findOne({
      token: token,
    })
      .lean()
      .select("-password -token");
    //Nếu không đúng thì return tài khoản mật khẩu ko đúng
    if (!userEmployer) {
      res.status(401).json({ error: "Xác Thực Thất Bại!" });
      return;
    }
    //Nếu tài khoản bị khóa thì trả về thông báo tài khoản bị khóa
    if (userEmployer.status !== "active") {
      res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
      return;
    }
 

    
    //lấy ra thông tin cần thiết của user
    const recordNew = {
      id: userEmployer._id,
      fullName: userEmployer.fullName,
      email: userEmployer.email,
     
    };

    res.status(200).json({
      success: "Xác Thự Thành Công!",
      token: token,
      code: 200,
      infoUserEmployer: recordNew,
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};