export const filterQuerySearch = (query : string) : RegExp=>{
    //Tạo mỗi chuỗi regex nó có tác dụng tìm chuỗi keyword không phân biệt chữ hoa chữ thường
    //Nói chung nó sẽ tìm kiếm tương đương
   const regex : RegExp = new RegExp(query,"i");
   return regex;
}