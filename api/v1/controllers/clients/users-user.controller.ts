import {
  generateRandomNumber,
  generateRandomString,
} from "../../../../helpers/generateString";
import { Request, Response } from "express";
import md5 from "md5";
import User from "../../../../models/user.model";
import { InfoUser } from "../../interfaces/user.interface";
import ForgotPassword from "../../../../models/forgot-password.model";
import { sendMail } from "../../../../helpers/sendMail";
import Job from "../../../../models/jobs.model";

// [POST] /api/v1/clients/users/allow-setting-user
export const allowSettingUser = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keyword: string = req.body.keyword;
    const status: boolean = Boolean(req.body.status);
    const email: string = req["user"]["email"];
    enum keyStatus {
      allowSearch = "allow-search",
      activateJobSearch = "activate-job-search",
    }

    switch (keyword) {
      case keyStatus.allowSearch:
        await User.updateOne(
          { email: email },
          {
            allowSearch: status,
          }
        );
        break;
      case keyStatus.activateJobSearch:
        await User.updateOne(
          { email: email },
          {
            activeJobSearch: status,
          }
        );
        break;
      default:
        break;
    }
    res.status(200).json({ code: 200, success: `Thành Công!` });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/upload-avatar
export const uploadAvatar = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const email: string = req["user"]["email"];
    await User.updateOne(
      { email: email },
      {
        avatar: req.body["thumbUrl"],
      }
    );
    res.status(200).json({ code: 200, success: `Thành Công!` });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/register
export const register = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy info người dùng gửi lên xong lưu vào object infoUser
    const infoUser: InfoUser = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      token: generateRandomString(30),
    };
    //Lưu tài khoản vừa tạo vào database
    const user = new User(infoUser);
    await user.save();

    //Lưu token vừa tạo vào cookie
    const token: string = user.token;
    res.cookie("token", token);
    res
      .status(200)
      .json({ code: 200, success: "Tạo Tài Khoản Thành Công!", token: token });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/login
export const login = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy email ,password người dùng gửi lên
    const email: string = req.body.email;
    const password: string = req.body.password;
    //Check xem trong databse có tồn tại email và mật khẩu có đúng hay không!
    const user = await User.findOne({
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
    res.cookie("token", token);
    res
      .status(200)
      .json({ code: 200, success: "Đăng Nhập Thành Công!", token: token });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ code: 500, error: "Internal Server Error" });
  }
};
// [POST] /api/v1/clients/users/password/forgot
export const forgotPassword = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy Email khi người dùng gửi lên
    const email: string = req.body.email;
    //Check email này có trong database hay không
    const user = await User.findOne({
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
    const checkRecord = await ForgotPassword.findOne({
      email: email,
    });
    //Tạo một biến otp để lưu otp
    let tokenReset: string;
    //Nếu bản ghi tồn tại và qua 60s trong validate rồi thì ta cho người dùng một otp mới,điều đơn giản chỉ là updte cái otp cũ
    if (checkRecord) {
      await ForgotPassword.updateOne(
        {
          email: email,
        },
        objectForgotPassword
      );
      tokenReset = objectForgotPassword.tokenReset;
    } //Nếu chưa có bản ghi nào tồn tại ta tạo otp mới cho người dùng
    else {
      //Lưu vào database
      const record = new ForgotPassword(objectForgotPassword);
      await record.save();
      tokenReset = record.tokenReset;
    }

    //Mấy đoạn dưới dài như này là html css cái form gửi otp về
    const subject: string = "Reset mật khẩu";

    //Bắt đầu gửi mail bằng hàm sendMail này
    sendMail(email, subject, tokenReset);
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

// [POST] /api/v1/clients/users/password/check-token
export const checkToken = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const tokenReset: string = req.body.tokenReset;
    //Check dữ vào database dữ liệu người dùng gửi lên
    const record = await ForgotPassword.findOne({
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

// [POST] /api/v1/clients/users/password/reset
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
    const user = await User.findOne({
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
      await User.updateOne(
        { email: email },
        {
          password: md5(password),
          token: tokenNew,
        }
      );
    } else {
      await User.updateOne(
        { email: email },
        {
          password: md5(password),
        }
      );
    }
    //Xóa bản ghi trong database ForgotPassword khi đã đổi mật khẩu thành công
    await ForgotPassword.deleteOne({ email: email });
    res.status(200).json({ code: 200, success: `Đổi Mật Khẩu Thành Công!` });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/detail
export const detail = async function (
  req: Request,
  res: Response
): Promise<void> {
  //lấy ra ra req.user được lưu ở middlewares auth
  const user = req["user"];
  //gán dữ liệu user vào info
  res.status(200).json({ success: `Thành Công!`, info: user });
};

// [POST] /api/v1/clients/users/list
export const list = async function (
  req: Request,
  res: Response
): Promise<void> {
  //Lâý danh sách list tất cả user để truyền ra api
  const user = await User.find({
    deleted: false,
  }).select("fullName email");
  res.status(200).json({ success: `Thành Công!`, user: user });
};

// [POST] /api/v1/clients/users/authen
export const authen = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const token = req.body.token;
    //Tạo một mảng POPULATE có định dạng mặc định như dưới

    //Check xem trong databse có tồn tại token và mật khẩu có đúng hay không!
    const userClient = await User.findOne({
      token: token,
    })
      .lean()
      .select("-password -token");
    //Nếu không đúng thì return tài khoản mật khẩu ko đúng
    if (!userClient) {
      res.status(401).json({ error: "Xác Thực Thất Bại!" });
      return;
    }
    //Nếu tài khoản bị khóa thì trả về thông báo tài khoản bị khóa
    if (userClient.status !== "active") {
      res.status(401).json({ error: "Tài Khoản Đã Bị Khóa!" });
      return;
    }
    const convertData = [];

    //Kiểm tra xem user có job_position không
    if (userClient?.job_position?.length > 0) {
      const checkTag = await Job.find({
        listTagSlug: { $in: userClient.job_position },
      }).select("listTagName listTagSlug");
     
      const userJobPositionsSet = new Set(userClient.job_position); // Tạo một Set từ mảng job_position để tối ưu hóa việc kiểm tra tồn tại
      // Duyệt qua mảng checkTag để kiểm tra từng tag có tồn tại trong Set không
      
      checkTag.forEach((item) => {
        item.listTagName.forEach((tag, index) => {
          //Lấy tagSlug từ mảng listTagSlug tương ứng với tag
          const tagSlug = item.listTagSlug[index];
          // Kiểm tra nhanh chóng sự tồn tại trong Set
          if (userJobPositionsSet.has(tagSlug)) {
            //Nếu thấy phần tử tồn tại thì push vào mảng convertData
            convertData.push({ label: tag, value: tagSlug });
            userJobPositionsSet.delete(tagSlug); // Xóa phần tử đã kiểm tra khỏi Set
          }
        });
      });
      // Duyệt qua các phần tử còn lại trong Set để kiểm tra xem có phần tử nào không tồn tại trong database không
      userJobPositionsSet.forEach(function(value) {
        //Lấy ra tag từ value xong push vào mảng convertData ở đây ta loại bỏ phần tử cuối cùng là - và thay thế bằng khoảng trắng
        const tag = value.replace(/-/g, " ");
        convertData.push({ label: tag, value: value });
      
      });
    }

    //lấy ra thông tin cần thiết của user
    const recordNew = {
      id: userClient._id,
      fullName: userClient.fullName,
      email: userClient.email,
      activeJobSearch: userClient.activeJobSearch,
      allowSearch: userClient.allowSearch,
      avatar: userClient.avatar,
      phone: userClient.phone || "",
      gender: userClient.gender || "",
      job_categorie_id: userClient.job_categorie_id || "",
      job_position: convertData || [],
      skill_id: userClient.skill_id || "",
      yearsOfExperience: userClient.yearsOfExperience || "",
      desiredSalary: userClient.desiredSalary || "",
      workAddress: userClient.workAddress || "",
      emailSuggestions: userClient.emailSuggestions || [],
    };

    res.status(200).json({
      success: "Xác Thự Thành Công!",
      token: token,
      code: 200,
      infoUser: recordNew,
    });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/change-password
export const changePassword = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy ra mật khẩu mới
    const newPassword = req.body.newPassword;
    const email = req["user"].email;
    const accept: boolean = req.body?.accept;
    //Nếu có accpet thì tạo một token mới
    let tokenNew: string = "";
    if (accept) {
      tokenNew = generateRandomString(30);
      await User.updateOne(
        { email: email },
        {
          password: md5(newPassword),
          token: tokenNew,
        }
      );
    } else {
      await User.updateOne(
        { email: email },
        {
          password: md5(newPassword),
        }
      );
    }

    res.status(200).json({
      code: 200,
      success: `Đổi mật khẩu thành công!`,
      tokenNew: tokenNew,
    });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/change-info-user
export const changeInfoUser = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const fullName = req.body.fullName;
    const phone = req.body.phone;
    const email = req["user"].email;
    await User.updateOne(
      {
        email: email,
      },
      {
        fullName: fullName,
        phone: phone,
      }
    );

    res
      .status(200)
      .json({ code: 200, success: `Thay đổi thông tin thành công!` });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// [POST] /api/v1/clients/users/change-job-suggestions
export const changeJobSuggestions = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const email = req["user"].email;
    const {
      gender,
      job_categorie_id,
      job_position,
      skill_id,
      yearsOfExperience,
      desiredSalary,
      workAddress,
    } = req.body;

    await User.updateOne(
      {
        email: email,
      },
      {
        gender,
        job_categorie_id,
        job_position,
        skill_id,
        yearsOfExperience,
        desiredSalary,
        workAddress,
      }
    );
    res
      .status(200)
      .json({ code: 200, success: `Thay đổi thông tin thành công!` });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/clients/users/change-job-suggestions
export const changeEmailSuggestions = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
      const {emailCheck} = req.body;
      const email = req["user"].email;
      await User.updateOne({email: email}, {emailSuggestions: emailCheck})
      res.status(200).json({ code: 200, success: `Cập nhật thông báo qua email thành công!` });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}