import { Request, Response } from "express";
import { filterQueryStatusJobs } from "../../../../helpers/filterQueryStatus.";
import {
  filterQueryEducationalLevelJobs,
  filterQueryLevelJobs,
  filterQueryWorkExperienceJobs,
} from "../../../../helpers/filterQuery Validate";
export const createRecord = (req: Request, res: Response, next: any): void => {
  try {
    //Lấy dữ liệu người dùng gửi lên
    const title: string = req.body.title.toString();
    const employerId: string = req.body.employerId.toString();
    const job_categorie_id: string = req.body.job_categorie_id.toString();
    const level: string = req.body.level.toString();
    const jobType: string[] = req.body.jobType.toString();
    const welfare: string[] = req.body.welfare;
    const presentationLanguage: string[] = req.body.presentationLanguage;
    const salaryMin: number = parseInt(req.body.salaryMin);
    const salaryMax: number = parseInt(req.body.salaryMax);
    const gender: string = req.body.gender.toString();
    const educationalLevel: string = req.body.educationalLevel.toString();
    const workExperience: string = req.body.workExperience.toString();
    const status: string = req.body.status.toString();
    const phone: string = req.body.phone.toString();
    const email: string = req.body.email.toString();
    const featured: boolean = req.body.featured;
    const city: string[] = req.body.city;
    const end_date: Date = new Date(req.body.end_date);
    const receiveEmail: string = req.body.receiveEmail.toString();
    const address: string = req.body.address.toString();
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
      res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
      return;
    }

    if (!employerId) {
      res.status(400).json({ error: "Vui Lòng Chọn Công Ty!" });
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

    if (!status) {
      res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
      return;
    }
    if (!filterQueryStatusJobs(status)) {
      res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!" });
      return;
    }

    if (!welfare && welfare.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!" });
      return;
    }
    if(!city && city.length < 1){
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

    if (featured === undefined) {
      res.status(400).json({ error: "Vui Lòng Chọn Nổi Bật!" });
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


export const editStatus = (req: Request, res: Response, next: any): void => {

  const status: string = req.body.status;
  //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
  if (!status) {
       res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
       return;
  }
  //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
  if (!filterQueryStatusJobs(status)) {
       res.status(400).json({ error: "Dữ Liệu  Trạng Thái Không Hợp Lệ!", code: 400 });
       return;
  }
  next();
}

export const editRecord = (req: Request, res: Response, next: any): void => {
  try {
    //Lấy dữ liệu người dùng gửi lên
    const title: string = req.body.title.toString();
    const employerId: string = req.body.employerId.toString();
    const job_categorie_id: string = req.body.job_categorie_id.toString();
    const level: string = req.body.level.toString();
    const jobType: string[] = req.body.jobType.toString();
    const welfare: string[] = req.body.welfare;
    const presentationLanguage: string[] = req.body.presentationLanguage;
    const salaryMin: number = parseInt(req.body.salaryMin);
    const salaryMax: number = parseInt(req.body.salaryMax);
    const gender: string = req.body.gender.toString();
    const educationalLevel: string = req.body.educationalLevel.toString();
    const workExperience: string = req.body.workExperience.toString();
    const status: string = req.body.status.toString();
    const phone: string = req.body.phone.toString();
    const email: string = req.body.email.toString();
    const featured: boolean = req.body.featured;
    const end_date: Date = new Date(req.body.end_date);
    const receiveEmail: string = req.body.receiveEmail.toString();
    const address: string = req.body.address.toString();
    //Nếu dữ liệu người dùng gửi lên là rỗng thì báo lỗi chưa có dữ liệu
    if (!title) {
      res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
      return;
    }

    if (!employerId) {
      res.status(400).json({ error: "Vui Lòng Chọn Công Ty!" });
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

    if (!status) {
      res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
      return;
    }
    if (!filterQueryStatusJobs(status)) {
      res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!" });
      return;
    }

    if (!welfare && welfare.length < 1) {
      res.status(400).json({ error: "Vui Lòng Chọn Phúc Lợi!" });
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

    if (featured === undefined) {
      res.status(400).json({ error: "Vui Lòng Chọn Nổi Bật!" });
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
