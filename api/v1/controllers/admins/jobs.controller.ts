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

// [GET] /api/v1/admin/jobs/index/
//VD: //VD: {{BASE_URL}}/api/v1/admin/admin/jobs?page=1&limit=7&sortKey=title&sortValue=asc&status=active&featured=true&salaryKey=gt&salaryValue=1000&jobLevel=Intern&occupationKey=software-development
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const permissions = req["userAdmin"].permissions;
    if (!permissions.includes("jobs-view")) {
      res
        .status(401)
        .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
      return;
    }
    //Khai báo biến find.
    //Đoạn or là lấy ra các id có trong trường createdBy hoặc nếu không có trong trường createdBy thì lấy ra trong mảng listUsser nếu có
    //Nói chung có nghĩa là lấy các user có quyền tham gia được task này
    const find: JobInterface.Find = {
      deleted: false,
    };

    //Khai báo các biến query
    let queryStatus: string = "";
    let querySortKey: string = "";
    let querySortValue: string = "";
    let queryPage: number = 1;
    let queryLimit: number = 6;
    let queryKeyword: string = "";
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
        path: "employerId",
        select: "image companyName address",
        model: Employer,
      },
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
    //Chuyển dữ liệu mongoDb sang kiểu dữ liệu bình thường để đổi được tên và thêm trường
    const convertData = records.map((record) => ({
      ...record.toObject(),
      companyName: record["employerId"]["companyName"],
      companyImage: record["employerId"]["image"],
    }));

    //Mã hóa dữ liệu khi gửi đi
    const dataEncrypted = encryptedData(convertData);

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

// [POST] /api/v1/admin/jobs/create
export const create = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const permissions = req["userAdmin"].permissions;
    if (!permissions.includes("jobs-create")) {
      res
        .status(401)
        .json({ error: "Bạn Không Có Quyền Thực Hiện Thao Tác Này!" });
      return;
    }
   
    let listSlugTag = [];
    //Nếu tồn tại listTagName thì tạo ra một mảng listSlugTag
    if (req.body?.listTagName?.length > 0) {
      //Tạo ra một mảng listSlugTag
      listSlugTag = req.body.listTagName.map((item) =>`${slug(item)}-${Date.now()}`)
    }
    //Định dạng bản ghi lưu vào database
    const Jobs: JobInterface.Find = {
      title: req.body.title,
      description: req.body.description || "",
      employerId: req.body.employerId,
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
      status: req.body.status,
      detailWorkExperience: req.body.detailWorkExperience || "",
      linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
      welfare: req.body.welfare,
      phone: req.body.phone,
      email: req.body.email,
      featured: req.body.featured,
      end_date: req.body.end_date,
      listTagName: req.body.listTagName || [],
      listTagSlug:listSlugTag || [],
      receiveEmail: req.body.receiveEmail,
      address: {
        location: req.body.address,
        linkMap: req.body.location || "",
      },
      city: req.body.city,
    };

    const record = new Job(Jobs);
    await record.save();

    res
      .status(201)
      .json({ success: "Tạo Công Việc Thành Công!", code: 201 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /api/v1/admin/jobs/delete/:id
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

// [PATCH] /api/v1/admin/jobs/change-status/:id
export const changeStatus = async function (
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
      .json({ success: "Cập Nhật Trạng Thái Thành Công!", code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /api/v1/admin/jobs/edit/:id
export const edit = async function (
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
    let listSlugTag = [];
    //Nếu tồn tại listTagName thì tạo ra một mảng listSlugTag
    if (req.body.listTagName.length > 0) {
      //Tạo ra một mảng listSlugTag
      listSlugTag = req.body.listTagName.map((item) =>`${slug(item)}-${Date.now()}`)
    }

    //tạo một object recordNew để lưu dữ liệu mới
    //Định dạng bản ghi lưu vào database
    const recordNew: JobInterface.Find = {
      title: req.body.title,
      description: req.body.description || "",
      employerId: req.body.employerId,
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
      status: req.body.status,
      detailWorkExperience: req.body.detailWorkExperience || "",
      linkVideoAboutIntroducingJob: req.body.linkVideoAboutIntroducingJob || "",
      welfare: req.body.welfare,
      phone: req.body.phone,
      email: req.body.email,
      featured: req.body.featured,
      end_date: req.body.end_date,
      listTagName:req.body.listTagName || [],
      listTagSlug: listSlugTag,
      receiveEmail: req.body.receiveEmail,
      address: {
        location: req.body.address,
        linkMap: req.body.location || "",
      },
      city: req.body.city,
    };

    //Lấy ra id công việc muốn chỉnh sửa
    const id: string = req.params.id.toString();
    //Update công việc đó!
    await Job.updateOne({ _id: id }, recordNew);

    res
      .status(200)
      .json({ success: "Cập Nhật Công Việc Thành Công!", code: 200 });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /api/v1/admin/jobs/change-multi
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
