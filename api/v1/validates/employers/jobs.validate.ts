import { Request, Response } from "express";
import {
  filterQueryStatusCvJobsEmployer,
  filterQueryStatusJobs,
  filterQueryStatusJobsEmployer,
} from "../../../../helpers/filterQueryStatus.";
import {
  filterQueryEducationalLevelJobs,
  filterQueryLevelJobs,
  filterQueryWorkExperienceJobs,
} from "../../../../helpers/filterQuery Validate";
import Job from "../../../../models/jobs.model";
import User from "../../../../models/user.model";
export const createRecord = (req: Request, res: Response, next: any): void => {
  try {
    //Lấy dữ liệu người dùng gửi lên
    const title: string = req.body.title || "";
    const job_categorie_id: string = req.body.job_categorie_id || "";
    const level: string = req.body.level || "";
    const jobType: string[] = req.body.jobType || "";
    const welfare: string[] = req.body.welfare;
    const presentationLanguage: string[] = req.body.presentationLanguage;
    const salaryMin: number = parseInt(req.body.salaryMin);
    const salaryMax: number = parseInt(req.body.salaryMax);
    const gender: string = req.body.gender || "";
    const educationalLevel: string = req.body.educationalLevel || "";
    const workExperience: string = req.body.workExperience || "";
    const phone: string = req.body.phone || "";
    const email: string = req.body.email || "";
    const city: string[] = req.body.city;
    const end_date: Date = new Date(req.body.end_date);
    const receiveEmail: string = req.body.receiveEmail || "";
    const address: string = req.body.address || "";
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
      res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
      return;
    }

    if (!job_categorie_id) {
      res.status(400).json({ error: "Vui Lòng Chọn Danh Mục Công Việc!" });
      return;
    }

    if (!jobType || jobType.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Loại Công Việc!" });
      return;
    }

    if (salaryMin < 1000000) {
      res.status(400).json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!" });
      return;
    }

    if (salaryMax < 1000000) {
      res.status(400).json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!" });
      return;
    }

    if (!gender) {
      res.status(400).json({ error: "Vui Lòng Chọn Giới Tính!" });
      return;
    }

    if (!level) {
      res.status(400).json({ error: "Vui Lòng Chọn Cấp Bậc!" });
      return;
    }

    if (!filterQueryLevelJobs(level)) {
      res.status(400).json({ error: "Dữ Liệu Cấp Bậc Không Hợp Lệ!" });
      return;
    }

    if (!educationalLevel) {
      res.status(400).json({ error: "Vui Lòng Chọn Trình Độ Học Vấn!" });
      return;
    }

    if (!filterQueryEducationalLevelJobs(educationalLevel)) {
      res.status(400).json({ error: "Dữ Liệu Trình Độ Học Vấn Không Hợp Lệ!" });
      return;
    }

    if (!workExperience) {
      res.status(400).json({ error: "Vui Lòng Chọn Kinh Nghiệm Làm Việc!" });
      return;
    }

    if (!filterQueryWorkExperienceJobs(workExperience)) {
      res.status(400).json({ error: "Dữ Liệu Kinh Nghiệm Không Hợp Lệ!" });
      return;
    }

    if (!welfare && welfare.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!" });
      return;
    }
    if (!city && city.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Thành Phố!" });
      return;
    }
    if (!presentationLanguage && presentationLanguage.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Ngôn Ngữ Trình Bày!" });
      return;
    }
    if (!phone) {
      res.status(400).json({ error: "Vui Lòng Nhập Số Điện Thoại!" });
      return;
    }

    if (!email) {
      res.status(400).json({ error: "Vui Lòng Nhập Email!" });
      return;
    }

    if (isNaN(end_date.getTime())) {
      res.status(400).json({ error: "Ngày Kết Thúc Không Hợp Lệ!" });
      return;
    }

    if (!receiveEmail) {
      res.status(400).json({ error: "Vui Lòng Chọn Ngôn Ngữ Nhận Email!" });
      return;
    }
    if (!address) {
      res.status(400).json({ error: "Vui Lòng Nhập Địa Chỉ!" });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editStatus = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  const user = req["user"];

  const status: string = req.body.status;
  //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
  if (!status) {
    res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
    return;
  }

  //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
  if (!filterQueryStatusJobsEmployer(status)) {
    res
      .status(400)
      .json({ error: "Dữ liệu trạng thái không hợp lệ.", code: 400 });
    return;
  }
  //Lấy thông tin công việc của nhà tuyển dụng gửi lên
  const job = await Job.findOne({
    employerId: user._id,
    _id: req.params.id,
  });
  //Nếu không tìm thấy công việc thì báo lỗi không tìm thấy dữ liệu
  if (!job) {
    res.status(400).json({ error: "Dữ liệu không hợp lệ.", code: 400 });
    return;
  }
  //Nếu trạng thái công việc không phải là active hoặc inactive thì báo lỗi yêu cầu của bạn không được chấp nhận
  if (!filterQueryStatusJobsEmployer(job.status)) {
    res
      .status(400)
      .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
    return;
  }
  next();
};

export const editRecord = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    //Lấy dữ liệu người dùng gửi lên
    const title: string = req.body.title || "";
    const job_categorie_id: string = req.body.job_categorie_id || "";
    const level: string = req.body.level || "";
    const jobType: string[] = req.body.jobType || "";
    const welfare: string[] = req.body.welfare;
    const presentationLanguage: string[] = req.body.presentationLanguage;
    const salaryMin: number = parseInt(req.body.salaryMin);
    const salaryMax: number = parseInt(req.body.salaryMax);
    const gender: string = req.body.gender || "";
    const educationalLevel: string = req.body.educationalLevel || "";
    const workExperience: string = req.body.workExperience || "";
    const phone: string = req.body.phone || "";
    const email: string = req.body.email || "";
    const city: string[] = req.body.city;
    const end_date: Date = new Date(req.body.end_date);
    const receiveEmail: string = req.body.receiveEmail || "";
    const address: string = req.body.address || "";
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
      res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!", code: 400 });
      return;
    }

    if (!job_categorie_id) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Danh Mục Công Việc!", code: 400 });
      return;
    }

    if (!jobType || jobType.length < 1) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Loại Công Việc!", code: 400 });
      return;
    }

    if (salaryMin < 1000000) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!", code: 400 });
      return;
    }

    if (salaryMax < 1000000) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Nhập Lương Tối Thiểu!", code: 400 });
      return;
    }

    if (!gender) {
      res.status(400).json({ error: "Vui Lòng Chọn Giới Tính!", code: 400 });
      return;
    }

    if (!level) {
      res.status(400).json({ error: "Vui Lòng Chọn Cấp Bậc!", code: 400 });
      return;
    }

    if (!filterQueryLevelJobs(level)) {
      res
        .status(400)
        .json({ error: "Dữ Liệu Cấp Bậc Không Hợp Lệ!", code: 400 });
      return;
    }

    if (!educationalLevel) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Trình Độ Học Vấn!", code: 400 });
      return;
    }

    if (!filterQueryEducationalLevelJobs(educationalLevel)) {
      res
        .status(400)
        .json({ error: "Dữ Liệu Trình Độ Học Vấn Không Hợp Lệ!", code: 400 });
      return;
    }

    if (!workExperience) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Kinh Nghiệm Làm Việc!", code: 400 });
      return;
    }

    if (!filterQueryWorkExperienceJobs(workExperience)) {
      res
        .status(400)
        .json({ error: "Dữ Liệu Kinh Nghiệm Không Hợp Lệ!", code: 400 });
      return;
    }

    if (!welfare && welfare.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!", code: 400 });
      return;
    }
    if (!city && city.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Thành Phố!", code: 400 });
      return;
    }
    if (!presentationLanguage && presentationLanguage.length < 1) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Ngôn Ngữ Trình Bày!", code: 400 });
      return;
    }
    if (!phone) {
      res
        .status(400)
        .json({ error: "Vui Lòng Nhập Số Điện Thoại!", code: 400 });
      return;
    }

    if (!email) {
      res.status(400).json({ error: "Vui Lòng Nhập Email!", code: 400 });
      return;
    }

    if (isNaN(end_date.getTime())) {
      res.status(400).json({ error: "Ngày Kết Thúc Không Hợp Lệ!", code: 400 });
      return;
    }

    if (!receiveEmail) {
      res
        .status(400)
        .json({ error: "Vui Lòng Chọn Ngôn Ngữ Nhận Email!", code: 400 });
      return;
    }
    if (!address) {
      res.status(400).json({ error: "Vui Lòng Nhập Địa Chỉ!", code: 400 });
      return;
    }
    const job = await Job.findOne({ _id: req.params.id });
    if (!job) {
      res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
      return;
    }
    //Nếu trạng thái công việc không phải là active hoặc inactive thì báo lỗi yêu cầu của bạn không được chấp nhận vì chỉ trường hợp đã active hoặc inactive thì mới edit được
    if (!filterQueryStatusJobsEmployer(job.status)) {
      res
        .status(400)
        .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getPdfToDriver = (
  req: Request,
  res: Response,
  next: any
): void => {
  try {
    if (!req.body.id_file) {
      res.status(400).json({ error: "File ID Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const actionCv = (req: Request, res: Response, next: any): void => {
  try {
    if (!req.body.status) {
      res.status(400).json({ error: "Trạng Thái Chưa Có Dữ Liệu!", code: 400 });
      return;
    }

    if (!req.body.idJob) {
      res
        .status(400)
        .json({ error: "ID Công Việc Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    if (!req.body.email) {
      res.status(400).json({ error: "Email Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    if (!filterQueryStatusCvJobsEmployer(req.body.status)) {
      res
        .status(400)
        .json({ error: "Yêu cầu của bạn không được chấp nhận.", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userPreviewJob = (
  req: Request,
  res: Response,
  next: any
): void => {
  try {
    const idJob: string = req.body.idJob;
    if (!idJob) {
      res
        .status(400)
        .json({ error: "ID Công Việc Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const buyUserPreviewJob = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    const idJob: string = req.body.idJob;
    const idUser: string = req.body.idUser;
    if (!idJob) {
      res
        .status(400)
        .json({ error: "ID công việc chưa có dữ liệu!", code: 400 });
      return;
    }
    if (!idUser) {
      res
        .status(400)
        .json({ error: "ID người dùng chưa có dữ liệu!", code: 400 });
      return;
    }

    const jobCheckUser = await Job.findOne({
      _id: idJob,
      "listProfileViewJob.idUser": idUser,
    });
    if (!jobCheckUser) {
      res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
      return;
    }

    const jobCheck = await Job.findOne({
      _id: idJob,
      listProfileViewJob: {
        $elemMatch: {
          idUser: idUser,
          buy: true,
        },
      },
    });

    if (jobCheck) {
      res
        .status(400)
        .json({ error: "Bạn đã mua thông tin này rồi!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const followUserProfile = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    const idProfile: string = req.body.idProfile;
    const idJob: string = req.body.idJob;
    const user = req["user"];
    if(!idProfile) {
      res.status(400).json({ error: "ID Profile Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    if(!idJob) {
      res.status(400).json({ error: "ID Job Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    const record = await Job.findOne({
      _id: idJob,
      employerId: user._id,
      "listProfileViewJob.idUser": idProfile,
    });

    if (!record) {
      res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteFollowProfile = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    const idProfile: string = req.body.idProfile;
    const idJob: string = req.body.idJob;
    const user = req["user"];
    if(!idProfile) {
      res.status(400).json({ error: "ID Profile Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    if(!idJob) {
      res.status(400).json({ error: "ID Job Chưa Có Dữ Liệu!", code: 400 });
      return;
    }
    const record = await Job.findOne({
      _id: idJob,
      employerId: user._id,
      "listProfileViewJob.idUser": idProfile,
    });

    if (!record) {
      res.status(400).json({ error: "Dữ liệu không hợp lệ!", code: 400 });
      return;
    }
    next();
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
