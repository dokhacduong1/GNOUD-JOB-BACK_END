import { Request, Response } from "express";
import Employer from "../../../../models/employers.model";
import * as JobInterface from "../../interfaces/job.interface";
import { filterQueryStatus } from "../../../../helpers/filterQueryStatus.";
import { filterQuerySearch } from "../../../../helpers/filterQuerySearch";
import { filterQueryPagination } from "../../../../helpers/filterQueryPagination.";
import { POPULATE } from "../../interfaces/populate.interface";
import Job from "../../../../models/jobs.model";
import slug from "slug";
import { encryptedData } from "../../../../helpers/encryptedData";
import JobCategories from "../../../../models/jobCategories.model";
import { convertToSlug } from "../../../../helpers/convertToSlug";
import User from "../../../../models/user.model";
import { getFileDriverToBase64 } from "../../../../helpers/getFileToDriver";
import { assert } from "console";
import {
  sendMailEmployerAcceptCv,
  sendMailEmployerRefureCv,
} from "../../../../helpers/sendMail";
import Skill from "../../../../models/skills.model";

// [GET] /api/v1/employers/jobs/index/
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const find: JobInterface.Find = {
      deleted: false,
      employerId: req["user"]._id,
    };

    //Khai báo các biến query
    let queryStatus: string = "";
    let querySortKey: string = "";
    let querySortValue: string = "";
    let queryPage: number = 1;
    let queryLimit: number = 6;

    let queryFeatureValue: boolean = false;

    //Check xem có phải loại yêu thích không (Chức năng lọc yêu thích )
    if (req.query.featured) {
      queryFeatureValue = Boolean(req.query.featured);
    }

    //Check xem nếu query có status thì gán vào biến checkQueryStatus không thì gán bằng rỗng. (Chức Năng Check Trạng Thái)
    if (req.query.status) {
      queryStatus = req.query.status.toString() || "";
    }

    //Check xem nếu query có sortKey  thì gán vào biến sortKey không thì gán bằng title. (Chức Năng Sắp Xếp)
    if (req.query.sortKey) {
      querySortKey = req.query.sortKey.toString() || "title";
    }

    //Check xem nếu query có sortValue  thì gán vào biến sortValue không thì gán bằng desc. (Chức Năng Sắp Xếp)
    if (req.query.sortValue) {
      querySortValue = req.query.sortValue.toString() || "asc";
    }

    //Check xem nếu query có queryPage thì gán vào biến queryPage không thì gán bằng rỗng. (Chức Năng Phân Trang)
    if (req.query.page) {
      queryPage = parseInt(req.query.page.toString());
    }

    //Check xem nếu query có queryLimit thì gán vào biến queryLimit không thì gán bằng 1. (Chức Năng Phân Trang)
    if (req.query.limit) {
      queryLimit = parseInt(req.query.limit.toString());
    }

    //Check xem nếu query có queryKeyword thì gán vào biến queryKeyword không thì gán bằng rỗng. (Chức Tìm Kiếm)
    //Nếu tồn tại keyword bắt đầu tìm kiếm theo keyword đối chiếu database(Chức Tìm Kiếm)
    if (req.query.keyword) {
      //Lấy ra key word của người dùng gửi lên
      const keyword: string = req.query.keyword.toString();
      //Chuyển keyword về dạng regex
      const keywordRegex: RegExp = new RegExp(keyword, "i");
      //Chuyển tất cả sang dạng slug
      const unidecodeSlug: string = convertToSlug(keyword);
      //Chuyển slug vừa tạo qua regex
      const slugRegex: RegExp = new RegExp(unidecodeSlug, "i");
      //Tạo ra một mảng find có các tiêu chí tìm một là tìm theo title nếu không có tìm theo slug
      find["$or"] = [{ title: keywordRegex }, { keyword: slugRegex }];
    }

    if (req.query.jobCategoriesKey) {
      const keyword = req.query.jobCategoriesKey;

      const idCategories = await JobCategories.findOne({
        slug: keyword,
      }).select("id");
      find["job_categorie_id"] = idCategories.id;
    }

    //Trước khi gán status vào find thì kiểm tra query có hợp lệ hoặc tồn tại hay không. (Chức Năng Check Trạng Thái)
    if (queryStatus && filterQueryStatus(queryStatus)) {
      find["status"] = queryStatus;
    }

    //Nếu tồn tại feature thì gán nó với value người dùng gửi lên  (Chức năng lọc yêu thích )
    if (queryFeatureValue) {
      find["featured"] = queryFeatureValue;
    }

    //Check xem nếu query gửi lên số lương muốn kiểm tra thì thêm vào cho nó (Chức năng check Lương)
    if (req.query.salaryKey && req.query.salaryValue) {
      //Nếu người dùng gửi lên key là gt người ta muốn check giá lơn hơn một giá trị nào đó
      if (req.query.salaryKey === "gt") {
        find["salary"] = { $gt: parseInt(req.query.salaryValue.toString()) };
      }
      //Nếu người dùng gửi lên key là gt người ta muốn check giá nhỏ hơn một giá trị nào đó
      if (req.query.salaryKey === "lt") {
        find["salary"] = { $lt: parseInt(req.query.salaryValue.toString()) };
      }
    }

    //Check xem nếu query gửi lên level của công ty muốn tuyển (Chức năng tìm kiếm kinh nghiệm làm việc của job đó)
    if (req.query.jobLevel) {
      find["level"] = req.query.jobLevel.toString();
    }

    //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
    const countRecord = await Job.countDocuments(find);

    const objectPagination = filterQueryPagination(
      countRecord,
      queryPage,
      queryLimit
    );
    //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
    let sort = {};
    //Nếu tồn tại thì mới gán vào sort
    if (querySortKey && querySortValue) {
      sort = {
        [querySortKey]: querySortValue,
      };
    }
    //Tạo một mảng POPULATE có định dạng mặc định như dưới
    const populateCheck: POPULATE[] = [
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];

    //Check xem có bao job để phân trang
    const countJobs: number = Math.round(countRecord / queryLimit);

    let records = [];
    //Tìm tất cả các công việc.
    if (req.query.findAll) {
      records = await Job.find(find)
        .sort(sort)
        .select("")
        .populate(populateCheck);
    } else {
      records = await Job.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem || 4)
        .skip(objectPagination.skip || 0)
        .select("")
        .populate(populateCheck);
    }

    //Mã hóa dữ liệu khi gửi đi
    const dataEncrypted = encryptedData(records);

    //Trả về công việc đó.
    res
      .status(200)
      .json({ data: dataEncrypted, code: 200, countJobs: countJobs });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/employer/jobs/create
export const create = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = req["user"];

    let listSlugTag = [];
    //Nếu tồn tại listTagName thì tạo ra một mảng listSlugTag
    if (req.body?.listTagName?.length > 0) {
      //Tạo ra một mảng listSlugTag
      listSlugTag = req.body.listTagName.map(
        (item) => `${slug(item)}-${Date.now()}`
      );
    }
    //Định dạng bản ghi lưu vào database
    const Jobs: JobInterface.Find = {
      title: req.body.title,
      description: req.body.description || "",
      employerId: user._id,
      job_categorie_id: req.body.job_categorie_id,
      website: req.body.website || "",
      level: req.body.level,
      jobType: req.body.jobType,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      ageMin: req.body.ageMin || 0,
      ageMax: req.body.ageMax || 0,
      gender: req.body.gender,
      educationalLevel: req.body.educationalLevel,
      workExperience: req.body.workExperience,
      presentationLanguage: req.body.presentationLanguage,
      detailWorkExperience: req.body.detailWorkExperience || "",
      linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
      welfare: req.body.welfare,
      phone: req.body.phone,
      email: req.body.email,
      end_date: req.body.end_date,
      listTagName: req.body.listTagName || [],
      listTagSlug: listSlugTag || [],
      receiveEmail: req.body.receiveEmail,
      address: {
        location: req.body.address,
        linkMap: req.body.location || "",
      },
      city: req.body.city,
    };

    const record = new Job(Jobs);
    await record.save();

    res.status(201).json({ success: "Tạo Công Việc Thành Công!", code: 201 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/employer/jobs/delete/:id
export const deleteJobs = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const permissions = req["userAdmin"].permissions;
    if (!permissions.includes("jobs-delete")) {
      res
        .status(401)
        .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
      return;
    }
    //Lấy ra id công việc muốn xóa
    const id: string = req.params.id.toString();
    //Bắt đầu xóa mềm dữ liệu,nghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
    await Job.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /api/v1/employer/jobs/change-status/:id
export const changeStatus = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy id của thông tin trên params
    const id: string = req.params.id.toString();
    const status: string = req.body.status.toString();

    //Nếu qua được validate sẽ vào đây rồi update dữ liệu
    await Job.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    //Trả về cập nhật trạng thánh thành công
    res
      .status(200)
      .json({ success: "Cập nhật trạng thái thành công", code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /api/v1/employer/jobs/edit/:id
export const edit = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    let listSlugTag = [];
    //Nếu tồn tại listTagName thì tạo ra một mảng listSlugTag
    if (req.body?.listTagName?.length > 0) {
      //Tạo ra một mảng listSlugTag
      listSlugTag = req.body.listTagName.map(
        (item) => `${slug(item)}-${Date.now()}`
      );
    }
    //Định dạng bản ghi lưu vào database
    const Jobs: JobInterface.Find = {
      title: req.body.title,
      description: req.body.description || "",
      job_categorie_id: req.body.job_categorie_id,
      website: req.body.website || "",
      level: req.body.level,
      jobType: req.body.jobType,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      ageMin: req.body.ageMin || 0,
      ageMax: req.body.ageMax || 0,
      gender: req.body.gender,
      educationalLevel: req.body.educationalLevel,
      workExperience: req.body.workExperience,
      presentationLanguage: req.body.presentationLanguage,
      detailWorkExperience: req.body.detailWorkExperience || "",
      linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
      welfare: req.body.welfare,
      phone: req.body.phone,
      email: req.body.email,
      end_date: req.body.end_date,
      listTagName: req.body.listTagName || [],
      listTagSlug: listSlugTag || [],
      receiveEmail: req.body.receiveEmail,
      status: "pending",
      address: {
        location: req.body.address,
        linkMap: req.body.location || "",
      },
      city: req.body.city,
    };

    //Lấy ra id công việc muốn chỉnh sửa
    const id: string = req.params.id.toString();
    //Update công việc đó!
    await Job.updateOne({ _id: id }, Jobs);

    res
      .status(200)
      .json({ success: "Cập Nhật Công Việc Thành Công!", code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /api/v1/employer/jobs/change-multi
export const changeMulti = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const permissions = req["userAdmin"].permissions;
    if (!permissions.includes("jobs-edit")) {
      res
        .status(401)
        .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
      return;
    }
    enum KEY {
      STATUS = "status",
      DELETED = "deleted",
    }

    let ids: string[];
    let key: string;
    let value: string;
    //Mình sẽ lấy các phần tử người dùng gửi lên
    if (!req.body.ids || !req.body.key) {
      res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
      return;
    }
    if (req.body.ids) {
      ids = req.body.ids;
    }
    if (req.body.key) {
      key = req.body.key.toString();
    }
    if (req.body.value) {
      value = req.body.value.toString();
    }

    switch (key) {
      //Trường hợp này key bằng status
      case KEY.STATUS:
        //Nếu dữ liệu người dùng gửi lên không giống các trạng thái thì báo lỗi dữ liệu không hợp lệ
        if (!filterQueryStatus(value)) {
          res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!", code: 400 });
          return;
        }
        //Update dữ liệu người dùng
        await Job.updateMany(
          { _id: { $in: ids } },
          {
            status: value,
          }
        );
        //Trả về cập nhật trạng thánh thành công
        res
          .status(200)
          .json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
        break;
      case KEY.DELETED:
        //Xóa mềm dữ liệu của cảng mảng ids người dùng gửi lên,ghĩa là không xóa hẳn dữ liệu ra khỏi database mà chỉ chỉnh trường deteled thành true thôi
        await Job.updateMany(
          { _id: ids },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.status(200).json({ success: "Xóa Dữ Liệu Thành Công!", code: 200 });
        break;
      default:
        //Trả về lỗi nếu không tồn tại key hợp lệ nào
        res.status(400).json({
          error:
            "Yêu Cầu Không Hợp Lệ Hoặc Không Được Hỗ Trợ Vui Lòng Thử Lại!",
          code: 400,
        });
        break;
    }
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /api/v1/employers/jobs/info-job/
export const infoJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id || "";
    const user = req["user"];
    const status: string = (req.query.status as string) || "";
    const populateCheck: POPULATE[] = [
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
      {
        path: "listProfileRequirement.idUser",
        select: "avatar",
        model: User,
      },
    ];

    let query: any = {
      _id: id,
      employerId: user._id,
      status: { $nin: ["pending", "refuse"] },
      deleted: false,
    };

    const record = await Job.findOne(query)
      .populate(populateCheck)
      .select("-employerId");
    if (status && record) {
      record.listProfileRequirement = record.listProfileRequirement.filter(
        (item) => item.status === status
      );
    }
    if (!record) {
      res.status(200).json({ data: encryptedData([]), code: 200 });
      return;
    }

    const convertData = {
      ...record.toObject(),
      job_categories_title: record.job_categorie_id.map(
        (item: any) => item.title
      ),
    };

    // Mã hóa dữ liệu khi gửi đi
    const dataEncrypted = encryptedData(convertData);
    res.status(200).json({ data: dataEncrypted, code: 200 });
  } catch (error) {
    // Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/get-pdf
export const getPdfToDriver = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id_file = req.body.id_file;
    const base64 = await getFileDriverToBase64(id_file);
    res.status(200).json({ code: 200, data: base64 });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// [Post] /api/v1/employers/jobs/action-cv
export const actionCv = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      email,
      idJob,
      status,
    }: { email: string; idJob: string; status: string } = req.body;
    const populateCheck: POPULATE[] = [
      {
        path: "employerId",
        select: "companyName",
        model: Employer,
      },
    ];
    const subject = "Thông Báo Tuyển Dụng";
    if (status === "refuse") {
      const record = await Job.findOneAndUpdate(
        { _id: idJob },
        { $pull: { listProfileRequirement: { email: email } } },
        { new: true }
      ).populate(populateCheck);
      await sendMailEmployerRefureCv(email, subject, record);
    } else if (status === "accept") {
      const record = await Job.findOneAndUpdate(
        { _id: idJob, "listProfileRequirement.email": email },
        { $set: { "listProfileRequirement.$.status": status } },
        { new: true }
      ).populate(populateCheck);

      await sendMailEmployerAcceptCv(email, subject, record);
      if (!record) {
        res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
        return;
      }
    }

    res.status(200).json({ code: 200, success: "Cập nhật dữ liệu thành công" });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/count-view-cv
export const coutViewCv = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, idJob }: { email: string; idJob: string } = req.body;

    const record = await Job.findOneAndUpdate(
      { _id: idJob, "listProfileRequirement.email": email },
      { $inc: { "listProfileRequirement.$.countView": 1 } }
    );

    if (!record) {
      res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
      return;
    }

    res.status(200).json({ code: 200, success: "Cập nhật dữ liệu thành công" });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/user-preview-job

// Hàm để xem thông tin người dùng đã xem công việc
export const userPreviewJob = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy thông tin người dùng và id công việc từ request
    const user = req["user"];
    const idJob: string = req.body.idJob;

    // Định nghĩa cấu trúc populate để lấy thông tin người dùng và danh mục công việc
    const populateCheck: POPULATE[] = [
      {
        path: "listProfileViewJob.idUser",
        select: " -password -token -status -deleted -createdAt -updatedAt",
        model: User,
        populate: [
          {
            path: "job_categorie_id",
            select: "title",
            model: JobCategories,
          },
        ],
      },
    ];

    // Tìm công việc theo id người dùng và id công việc, sau đó populate thông tin người dùng và danh mục công việc
    const job = await Job.findOne({ employerId: user._id, _id: idJob })
      .populate(populateCheck)
      .select("listProfileViewJob");

    // Kiểm tra nếu không tìm thấy công việc hoặc không có người dùng nào xem công việc
    if (!job || !job.listProfileViewJob) {
      // Trả về lỗi 404 nếu không tìm thấy dữ liệu
      res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
      return;
    }

    // Chuyển đổi dữ liệu để chỉ trả về thông tin cần thiết
    const dataConvert = job.listProfileViewJob.map((item: any) => {
      //Nếu chưa mua thì không hiển thị email và phone
      if (!item.buy) {
        item["idUser"].email = "";
        item["idUser"].phone = "";
      }
      return {
        ...item.idUser.toObject(),
        dataTime: item.dataTime,
      };
    });

    // Trả về dữ liệu đã được chuyển đổi
    res.status(200).json({ data: dataConvert, code: 200 });
  } catch (error) {
    // Ghi lỗi vào console nếu có lỗi xảy ra
    console.error("Error in API:", error);
    // Trả về lỗi 500 nếu có lỗi xảy ra
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/buy-user-preview-job
// Hàm để mua thông tin người dùng đã xem công việc
export const buyUserPreviewJob = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Định nghĩa số lượng tối đa có thể mua
    const maxBuy: number = 10;

    // Lấy thông tin người dùng và số lượng GP từ request
    const user = req["user"];
    const cointsGP: number = user["cointsGP"];

    // Kiểm tra nếu số lượng GP không đủ để mua
    if (cointsGP < maxBuy) {
      // Trả về lỗi 400 nếu không đủ GP
      res.status(400).json({ error: "Bạn không đủ GP để mua dịch vụ này" });
      return;
    }

    // Lấy id công việc và id người dùng từ request
    const idJob: string = req.body.idJob;
    const idUser: string = req.body.idUser;

    // Cập nhật trạng thái mua của người dùng đã xem công việc
    await Job.updateOne(
      {
        employerId: user._id,
        _id: idJob,
        "listProfileViewJob.idUser": idUser,
      },
      {
        $set: { "listProfileViewJob.$.buy": true },
      }
    );

    // Giảm số lượng GP của người dùng sau khi mua
    await Employer.updateOne(
      {
        _id: user._id,
      },
      {
        $inc: { cointsGP: -maxBuy },
      }
    );

    // Trả về thông báo thành công
    res.status(200).json({ code: 200, success: "Bạn đã mua thành công" });
  } catch (error) {
    // Ghi lỗi vào console nếu có lỗi xảy ra
    console.error("Error in API:", error);
    // Trả về lỗi 500 nếu có lỗi xảy ra
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/info-user-profile
// Hàm để xem thông tin chi tiết người dùng
export const infoUserProfile = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy thông tin người dùng và id người dùng từ request
    const userId  : string = req["user"]?._id;
    const idUser: string = req.body.idUser;
    const idJob: string = req.body.idJob;
    interface IJob {
      _id: string;
      employerId: string;
      listProfileViewJob: Array<{
        idUser: string;
        buy: boolean;
      }>;
      // Các trường khác của Job...
    }
    // Định nghĩa các trường cần populate
    const populateCheck: POPULATE[] = [
      {
        path: "skill_id",
        select: "title",
        model: Skill,
      },
      {
        path: "job_categorie_id",
        select: "title",
        model: JobCategories,
      },
    ];

    // Tìm công việc mà người dùng đã mở liên hệ
    const findJob : IJob | null = await Job.findOne({
      _id: idJob,
      employerId: userId,
      listProfileViewJob: { $elemMatch: { idUser: idUser, buy: true } },
    }).select("_id");

    // Chọn các trường cần hiển thị dựa trên việc người dùng đã mở liên hệ hay chưa
    const defaultSelect = findJob?._id
      ? "-password -token -status -deleted -createdAt -updatedAt"
      : "-password -token -status -deleted -createdAt -updatedAt -email -phone";

    // Tìm thông tin người dùng và populate các trường cần thiết
    const result = await User.findOne({ _id: idUser })
      .select(defaultSelect)
      .populate(populateCheck);

    // Đếm số lượng thông tin đã được xác thực
    const count : number = [
      Object.keys(result?.skill_id).length > 0,
      result?.desiredSalary,
      result?.address?.city,
      result?.yearsOfExperience,
      result?.dateOfBirth,
    ].filter(Boolean).length;

    // Tạo một đối tượng mới với thông tin người dùng và mức độ xác thực
    const objectNew :  { [key: string]: any } = {
      ...result.toObject(),
      authentication_level: count,
    };

    // Trả về thông tin người dùng và mức độ xác thực
    res.status(200).json({ code: 200, data: objectNew });
  } catch (error) {
    // Ghi lỗi vào console nếu có lỗi xảy ra
    console.error("Error in API:", error);
    // Trả về lỗi 500 nếu có lỗi xảy ra
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [Post] /api/v1/employers/jobs/follow-user-profile
export const followUserProfile = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const idProfile: string = req.body.idProfile;
    const idJob: string = req.body.idJob;
    const user = req["user"];

    await Job.updateOne(
      {
        _id: idJob,
        employerId: user._id,
        "listProfileViewJob.idUser": idProfile,
      },
      {
        $set: { "listProfileViewJob.$.follow": true },
      }
    );

    res.status(200).json({ code: 200, success: "Bạn đã theo dõi người dùng" });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// [Post] /api/v1/employers/jobs/follow-user-job
// Hàm để xem thông tin người dùng mà nhà tuyển dụng đã theo dõi
export const followUserJob = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    
    // Lấy thông tin người dùng và id công việc từ request
    const userId : string = req["user"]._id;
    const idJob: string = req.body.idJob;

    // Định nghĩa cấu trúc populate để lấy thông tin người dùng và danh mục công việc
    const populateCheck: POPULATE[] = [
      {
        path: "listProfileViewJob.idUser",
        select: " -password -token -status -deleted -createdAt -updatedAt",
        model: User,
        populate: [
          {
            path: "job_categorie_id",
            select: "title",
            model: JobCategories,
          },
        ],
      },
    ];

    // Tìm công việc theo id người dùng và id công việc, sau đó populate thông tin người dùng và danh mục công việc
    const job = await Job.findOne({ employerId: userId, _id: idJob, "listProfileViewJob.follow": true })
      .populate(populateCheck)
      .select("listProfileViewJob");

    // Kiểm tra nếu không tìm thấy công việc hoặc không có người dùng nào xem công việc
    if (!job || !job.listProfileViewJob) {
      // Trả về lỗi 404 nếu không tìm thấy dữ liệu
      res.status(404).json({ error: "Không Tìm Thấy Dữ Liệu!", code: 404 });
      return;
    }
     // Chuyển đổi dữ liệu để chỉ trả về thông tin cần thiết
     const dataConvert = job.listProfileViewJob.filter(itemFilter=>itemFilter.follow === true).map((item: any) => {
      //Nếu chưa mua thì không hiển thị email và phone
      if (!item.buy) {
        item["idUser"].email = "";
        item["idUser"].phone = "";
      }
      return {
        ...item.idUser.toObject(),
        dataTime: item.dataTime,
      };
    });

    // Trả về dữ liệu đã được chuyển đổi
    res.status(200).json({ data: dataConvert, code: 200 });
  } catch (error) {
    // Ghi lỗi vào console nếu có lỗi xảy ra
    console.error("Error in API:", error);
    // Trả về lỗi 500 nếu có lỗi xảy ra
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// [Post] /api/v1/employers/jobs/delete-follow-profile
export const deleteFollowProfile = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const idProfile: string = req.body.idProfile;
    const idJob: string = req.body.idJob;
    const userId : string = req["user"]._id;

    await Job.updateOne(
      {
        _id: idJob,
        employerId: userId,
        "listProfileViewJob.idUser": idProfile,
      },
      {
        $set: { "listProfileViewJob.$.follow": false },
      }
    );

    res.status(200).json({ code: 200, success: "Bạn đã hủy theo dõi người dùng" });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};