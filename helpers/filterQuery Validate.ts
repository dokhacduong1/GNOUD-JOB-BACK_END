export const filterQueryWorkExperienceJobs = (query : string) : boolean => {

    //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
    let filterQueryValidate : string[] = ["no-required","experienced","no-experience-yet"];
  
     //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
     const checkQuery : boolean = filterQueryValidate.includes(query);

     return checkQuery;
}

export const filterQueryLevelJobs = (query : string) : boolean => {
    //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
    let filterQueryValidate : string[] = ["student-intern","just-have-graduated","staff","teamleader-supervisor","manage","vice-director","manager","general-manager","president-vicepresident"];
  
     //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
     const checkQuery : boolean = filterQueryValidate.includes(query);

     return checkQuery;
}

export const filterQueryEducationalLevelJobs = (query : string) : boolean => {
    //Tạo một mảng để ghi vào các giá trị mong muốn kiểm tra
    let filterQueryValidate : string[] = ["high-school","intermediate-level","college","iniversity","after-university","other"];
     //Kiểm tra xem trong mảng đã cho có tồn tại query vừa truyền vào hay không
     const checkQuery : boolean = filterQueryValidate.includes(query);

     return checkQuery;
}
