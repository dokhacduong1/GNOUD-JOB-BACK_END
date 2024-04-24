export const filterQueryWorkExperienceJobs = (query: string): boolean => {

 
  //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
  let filterQueryValidate: string[] = ["no-required", "no-experience-yet", "duoi_1_nam", "1_nam", "2_nam", "3_nam", "4_nam", "5_nam", "tren_5_nam"];

  //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
  const checkQuery: boolean = filterQueryValidate.includes(query);

  return checkQuery;
};

export const filterQueryLevelJobs = (query: string): boolean => {
  
  //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
  let filterQueryValidate: string[] = [
    "student-intern",
    "just-have-graduated",
    "staff",
    "teamleader-supervisor",
    "manage",
    "vice-director",
    "manager",
    "general-manager",
    "president-vicepresident",
  ];

  //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
  const checkQuery: boolean = filterQueryValidate.includes(query);

  return checkQuery;
};

export const filterQueryEducationalLevelJobs = (query: string): boolean => {
  //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
  let filterQueryValidate: string[] = [
    "high-school",
    "intermediate-level",
    "college",
    "iniversity",
    "after-university",
    "other",
  ];
  //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
  const checkQuery: boolean = filterQueryValidate.includes(query);

  return checkQuery;
};
