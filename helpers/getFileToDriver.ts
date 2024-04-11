import dotenv from "dotenv";
import { google } from "googleapis";
import stream from "stream";

// Tải các biến môi trường từ file .env
dotenv.config();

// Định nghĩa các thông tin xác thực cho Google Drive API
const CLIENT_ID = process.env.CLIENT_DRIVER_ID;
const CLIENT_SECRET = process.env.CLIENT_DRIVER_SECRET;
const REDIRECT_URI = process.env.REDIRECT_DRIVER_URI;
const REFRESH_TOKEN = process.env.REFRESH_DRIVER_TOKEN2;


export const getFileDriverToBase64 = async (fileId="",alt="media") => {
    try {
      // Khởi tạo OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
  
      // Đặt thông tin xác thực cho OAuth2 client
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
      // Khởi tạo Google Drive API client
      const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });
  
      // Tải file từ Google Drive
      const response = await drive.files.get({
        fileId: fileId,
        alt: alt,
      }, { responseType: 'stream' });
  
      // Chuyển đổi stream thành base64
    
      const base64 = await readableStreamToString(response.data);
      return base64;
    } catch (error) {
      console.log(error);
    }
  };
  
  const readableStreamToString = (readableStream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data);
      });
      readableStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('base64'));
      });
      readableStream.on('error', reject);
    });
  };