import dotenv from "dotenv";
import imgur from "imgur";
import axios from "axios";
import FormData from "form-data";
//Import cấu hình file .env
dotenv.config();

// Hàm để tải lên dữ liệu dưới dạng base64
const streamUpload = async (base64) => {
    // Khởi tạo fkey
    const fkey = "1be310e9b025b857f9d1035ea2fd78cf040285e434c4e4e30e4eeeeffc809466";
  
    // Khởi tạo form data
    const data = new FormData();
  
    // Chuyển đổi base64 thành Buffer
    const buffer = Buffer.from(base64, "base64");
  
    // Tạo một stream từ buffer
    const fileStream = require("stream").Readable.from(buffer);
  
    // Thêm stream như một file vào form-data
    data.append("file", fileStream, { filename: "image.png" });
  
    // Thêm fkey vào form-data
    data.append("fkey", fkey);
  
    // Cấu hình cho yêu cầu POST
    const config = {
      method: "post",
      url: "https://stackoverflow.com/upload/image",
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };
  
    try {
      // Gửi yêu cầu POST và lưu phản hồi vào biến response
      const response = await axios(config);
  
      // Kiểm tra nếu yêu cầu thành công
      if (response.data.Success) {
        // Tạo và trả về kết quả
        const result = {
          secure_url: response.data.UploadedImage,
        };
       
        return result;
      }
  
      // Trả về chuỗi rỗng nếu yêu cầu không thành công
      return "";
    } catch (error) {
      // Trả về chuỗi rỗng nếu có lỗi xảy ra
      return "";
    }
  };

//Upload 1 file
export const uploadSingle = async (buffer: Buffer) => {
  try {
    const result = await streamUpload(buffer);

    return result["secure_url"];
  } catch (error) {
    console.log(error);
  }
};

//Upload nhiều file
export const uploadMultiple = async (arrayBuffer: Buffer[]) => {
  const result = [];
  for (let buffer of arrayBuffer) {
    const link = await streamUpload(buffer);
    result.push(link["secure_url"]);
  }
  return result;
};
