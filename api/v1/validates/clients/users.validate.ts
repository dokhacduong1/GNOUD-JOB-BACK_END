import { Request, Response } from "express";
import User from "../../../../models/user.model";
import ForgotPassword from "../../../../models/forgot-password.model";
import * as md5 from "md5";
import Job from "../../../../models/jobs.model";
import Cv from "../../../../models/cvs.model";

//Hàm này kiểm tra Password
function validatePassword(password: string): boolean {
  // Ít nhất 8 ký tự
  if (password.length < 6) {
    return false;
  }
  //nhiều nhất 25 ký tự
  if (password.length > 25) {
    return false;
  }
  // Ít nhất một chữ hoa
  // if (!/[A-Z]/.test(password)) {
  //   return false;
  // }
  // Ít nhất một ký tự đặc biệt
  // if (!/[!@#$%^&*]/.test(password)) {
  //   return false;
  // }
  // Mật khẩu hợp lệ nếu vượt qua tất cả các điều kiện
  return true;
}
function validatePhoneNumber(phone: string): boolean {
  // Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone);
}

//Hàm này kiểm tra Email
function validateEmail(email: string): boolean {
  // Biểu thức chính quy kiểm tra địa chỉ email
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Kiểm tra xem địa chỉ email đáp ứng biểu thức chính quy hay không
  return emailRegex.test(email);
}

export const register = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  //Kiểm tra xem người dùng nhập email đúng hay không
  if (!validateEmail(req.body.email)) {
    res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
    return;
  }
  //Lọc email trong database
  const checkEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  //Nếu email đã có trong database trả về lỗi
  if (checkEmail) {
    res.status(401).json({ code: 401, error: "Email đã tồn tại!" });
    return;
  }
  //Kiểm tra xem password có đúng định dạng không
  if (!validatePassword(req.body.password)) {
    res.status(401).json({
      code: 401,
      error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
    });
    return;
  }
  //Check xem fullName có rỗng không
  if (!req.body.fullName) {
    res.status(401).json({ code: 401, error: "Vui Lòng Nhập Tên!" });
    return;
  }
  //Nếu thỏa mãn hết điều kiện thì cho next
  next();
};

export const login = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  //Kiểm tra xem người dùng nhập email đúng hay không
  if (!validateEmail(req.body.email)) {
    res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
    return;
  }

  //Kiểm tra xem người dùng nhập email hay chưa
  if (!req.body.password) {
    res.status(401).json({ code: 401, error: "Vui Lòng Nhập Mật Khẩu!" });
    return;
  }
  //Nếu thỏa mãn hết điều kiện thì cho next
  next();
};

export const forgotPassword = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const email: string = req.body.email;
  //Kiểm tra xem người dùng nhập email đúng hay không
  if (!validateEmail(email)) {
    res.status(401).json({ code: 401, error: "Email Không Hợp Lệ" });
    return;
  }
  const record = await ForgotPassword.findOne({
    email: email,
  });
  //Check xem nếu người dùng đã gửi phải bắt người dùng đợi
  if (record) {
    //Lấy timeWait lưu trong database để tạo một đối tượng date
    const dateObject: Date = new Date(record.timeWait);
    // Thời điểm hiện tại
    const currentDate: Date = new Date();
    // Tính toán khoảng thời gian giữa hai thời điểm
    const timeDifference: number = currentDate.getTime() - dateObject.getTime();
    // Chuyển đổi khoảng thời gian từ milliseconds sang giây
    const minutesDifference: number = Math.ceil(timeDifference / 1000);

    if (minutesDifference < 60) {
      res.status(401).json({
        code: 401,
        error: `Bạn không được gửi quá nhanh hãy thử Lại sau ${
          60 - minutesDifference
        } giây!`,
      });
      return;
    }
  }
  next();
};

export const checkToken = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  if (!req.body.tokenReset) {
    res.status(401).json({ error: "Vui lòng nhập token!" });
    return;
  }
  const record = await ForgotPassword.findOne({
    tokenReset: req.body.tokenReset,
  });
  if (!record) {
    res.status(401).json({
      code: 401,
      error: "Email này chưa được gửi otp vui lòng gửi otp và thử lại!",
    });
    return;
  }

  next();
};

export const resetPassword = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  if (!req.body.email) {
    res.status(401).json({ error: "Vui lòng nhập email!" });
    return;
  }
  const record = await ForgotPassword.findOne({
    email: req.body.email,
  });
  if (!record) {
    res.status(401).json({
      code: 401,
      error: "Email này chưa được gửi otp vui lòng gửi otp và thử lại!",
    });
    return;
  }
  if (!req.body.password) {
    res
      .status(401)
      .json({ code: 401, error: "Vui lòng không để trống mật khẩu!" });
    return;
  }
  //Kiểm tra xem password có đúng định dạng không
  if (!validatePassword(req.body.password)) {
    res.status(401).json({
      code: 401,
      error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
    });
    return;
  }
  if (req.body.password !== req.body.reEnterPassword) {
    res.status(401).json({
      code: 401,
      error: "Mật khẩu xác nhận chưa đúng!",
    });
    return;
  }
  next();
};

export const authen = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  //Kiểm tra xem người dùng nhập email hay chưa
  if (!req.body.token) {
    res.status(401).json({ code: 401, error: "Vui Lòng Nhập Token!" });
    return;
  }
  //Nếu thỏa mãn hết điều kiện thì cho next
  next();
};
export const allowSettingUser = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const keywordCheck = ["allow-search", "activate-job-search"];
  const keyword: string = req.body.keyword;
  const status = req.body.status;
  if (!keywordCheck.includes(keyword)) {
    res.status(401).json({ code: 401, error: "Keyword không hợp lệ!" });
    return;
  }

  if (typeof status !== "boolean") {
    res.status(401).json({ code: 401, error: "Status không hợp lệ!" });
    return;
  }
  next();
};

export const changePassword = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    //Lấy ra mật khẩu cũ
    const password = req.body.password;
    //Lấy ra mật khẩu mới
    const newPassword = req.body.newPassword;
    //Lấy ra mật khẩu nhập lại
    const reEnterPassword = req.body.reEnterPassword;
    //Lấy ra email
    const email = req["user"].email;
    //Lấy ra user từ database
    const user = await User.findOne({
      email: email,
      password: md5(password),
    });
    //Nếu không đúng thì return tài khoản mật khẩu ko đúng
    if (!user) {
      res.status(401).json({ code: 401, error: "Sai mật khẩu hiện tại!" });
      return;
    }
    //Nếu tài khoản không hoạt động thì trả về lỗi
    if (user.status !== "active") {
      res.status(401).json({ code: 401, error: "Tài khoản đã bị khóa!" });
      return;
    }
    //Kiểm tra xem có nhập đúng mật khẩu mới không xem khớp không
    if (newPassword !== reEnterPassword) {
      res.status(401).json({ code: 401, error: "Mật khẩu mới không khớp!" });
      return;
    }
    if (newPassword === password) {
      res.status(401).json({
        code: 401,
        error: "Mật khẩu mới không được trùng mật khẩu cũ!",
      });
      return;
    }
    //Kiểm tra xem password có đúng định dạng không
    if (!validatePassword(newPassword)) {
      res.status(401).json({
        code: 401,
        error: "Mật khẩu phải có độ dài từ 6 đến 25 ký tự!",
      });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeInfoUser = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const fullName: string = req.body.fullName;
    const phone: string = req.body.phone;
    const address: {} = req.body.address;
    if (!fullName) {
      res.status(401).json({ code: 401, error: "Vui lòng nhập tên!" });
      return;
    }
    if (!phone) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
      return;
    }
    if (!validatePhoneNumber(phone)) {
      res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
      return;
    }
    if (Object.keys(address).length === 0) {
      res.status(401).json({ code: 401, error: "Vui lòng nhập địa chỉ!" });
      return;
    }
    if (!address["city"]) {
      res.status(401).json({ code: 401, error: "Vui lòng nhập thành phố!" });
      return;
    }
    if (!address["district"]) {
      res.status(401).json({ code: 401, error: "Vui lòng nhập quận/huyện!" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeJobSuggestions = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const {
      gender,
      job_categorie_id,
      job_position,
      skill_id,
      yearsOfExperience,
      desiredSalary,
      workAddress,
      dateOfBirth,
    } = req.body;

    if (!gender) {
      res.status(401).json({ code: 401, error: "Vui lòng chọn giới tính!" });
      return;
    }
    if (!job_categorie_id) {
      res.status(401).json({ code: 401, error: "Vui lòng chọn ngành nghề!" });
      return;
    }
    if (!job_position) {
      res.status(401).json({ code: 401, error: "Vui lòng chọn vị trí!" });
      return;
    }
    if (!skill_id) {
      res.status(401).json({ code: 401, error: "Vui lòng chọn kỹ năng!" });
      return;
    }
    if (!yearsOfExperience) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn số năm kinh nghiệm!" });
      return;
    }
    if (!desiredSalary) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn mức lương mong muốn!" });
      return;
    }
    if (!workAddress) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn địa chỉ làm việc!" });
      return;
    }
    if (job_position.length < 1) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn ít nhất một vị trí!" });
      return;
    }
    if (skill_id.length < 1) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn ít nhất một kĩ năng!" });
      return;
    }
    if (workAddress.length < 1) {
      res
        .status(401)
        .json({ code: 401, error: "Vui lòng chọn ít nhất một địa chỉ!" });
      return;
    }
    if (job_position.length > 5) {
      res.status(401).json({
        code: 401,
        error: "Bạn chỉ được phép chọn 5 vị trí nếu là thành viên thường!",
      });
      return;
    }
    if (skill_id.length > 5) {
      res.status(401).json({
        code: 401,
        error: "Bạn chỉ được phép chọn 5 kĩ năng nếu là thành viên thường!",
      });
      return;
    }
    if (workAddress.length > 5) {
      res.status(401).json({
        code: 401,
        error:
          "Bạn chỉ được phép chọn 5 địa chỉ làm việc nếu là thành viên thường!",
      });
      return;
    }
    if (!dateOfBirth) {
      res.status(401).json({
        code: 401,
        error: "Vui lòng chọn ngày sinh!",
      });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeEmailSuggestions = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const checkEmailValidate = [
      "thong-bao-cap-nhat-quan-trong",
      "thong-bao-ntd-da-xem",
      "thong-bao-tinh-nang",
      "thong-bao-khac",
      "thong-bao-viec-lam-phu-hop",
      "thong-bao-ntd-moi-phong-van",
    ];
    const { emailCheck } = req.body;
    if (emailCheck.length > 0) {
      //Kiểm tra xem có phần tử nào không hợp lệ không bằng hàm every hàm này trả về true nếu tất cả phần tử đều hợp lệ
      const hasInvalidChoice = emailCheck.every((element: string) =>
        checkEmailValidate.includes(element)
      );
      if (!hasInvalidChoice) {
        res.status(401).json({
          code: 401,
          error: "Các lựa chọn của bạn có lựa chọn không hợp lệ!",
        });
        return;
      }
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const recruitmentJob = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const idJob = req.body.idJob;
  if (!req.body.phone) {
    res.status(401).json({ code: 401, error: "Vui lòng nhập số điện thoại!" });
    return;
  }
  if (!validatePhoneNumber(req.body.phone)) {
    res.status(401).json({ code: 401, error: "Số điện thoại không hợp lệ!" });
    return;
  }
  if (!req.body.email) {
    res.status(401).json({ code: 401, error: "Vui lòng nhập email!" });
    return;
  }
  if (!req.body.idJob) {
    res.status(401).json({ code: 401, error: "Vui lòng nhập id công việc!" });
    return;
  }
  if(!req.body.employerId){
    res.status(401).json({ code: 401, error: "Vui lòng nhập id nhà tuyển dụng!" });
    return;
  }
  //Check xem đã ứng tuyển chưa
  const exitsRequirement = await Cv.findOne({
    idJob: idJob,
    email: req["user"].email,
  });
  if (exitsRequirement) {
    res
      .status(401)
      .json({ code: 401, error: "Bạn đã ứng tuyển công việc này!" });
    return;
  }
  next();
};

export const uploadCv = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const user = req["user"];
  const fileName = req.body.fileName;
  if (!fileName) {
    res.status(401).json({ code: 401, error: "Vui lòng chọn file!" });
    return;
  }
  const exitedCv = user.cv.find((cv) => cv.nameFile === fileName);
  if (exitedCv) {
    res.status(401).json({ code: 401, error: "File đã tồn tại!" });
    return;
  }
  next();
};

export const editCvByUser = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  // Định nghĩa kiểu dữ liệu cho CV
  interface ICv {
    idFile: string;
    nameFile: string;
  }

  // Định nghĩa kiểu dữ liệu cho User
  interface IUser {
    cv: ICv[];
  }
  // Lấy thông tin người dùng từ request
  const user: IUser = req["user"];

  // Lấy idFile và newNameCv từ body của request
  const idFile: string = req.body.idFile;
  const newNameCv: string = req.body.newNameCv;

  // Kiểm tra xem idFile có tồn tại không
  if (!idFile) {
    res.status(401).json({ code: 401, error: "Vui lòng chọn file!" });
    return;
  }

  // Kiểm tra xem newNameCv có tồn tại không
  if (!newNameCv) {
    res.status(401).json({ code: 401, error: "Vui lòng nhập tên file!" });
    return;
  }

  // Tìm CV có nameFile và idFile khớp với newNameCv và idFile
  const checkCvName = user.cv.find(
    (cv: ICv) => cv.nameFile === newNameCv && cv.idFile === idFile
  );

  // Nếu tìm thấy CV, trả về thông báo thành công
  if (checkCvName) {
    res.status(200).json({ code: 201, success: "Cập nhật CV thành công" });
    return;
  }

  // Nếu không tìm thấy CV, chuyển đến middleware tiếp theo

  next();
};
