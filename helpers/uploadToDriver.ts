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

// Hàm để tải một file lên Google Drive
const streamUpload = async (base64) => {
  try {
    // Chuyển dữ liệu base64 thành dữ liệu nhị phân
    const binaryData = Buffer.from(base64, "base64");

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

    // Tạo một stream từ dữ liệu nhị phân
    const readableStream = new stream.PassThrough();
    readableStream.end(binaryData);

    // Tải file lên Google Drive
    const upload = await drive.files.create({
      requestBody: {
        name: "duong-image" + Date.now().toString() + ".png",
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: readableStream,
      },
    });

    // Đặt quyền truy cập công khai cho file
    await drive.permissions.create({
      fileId: upload.data["id"],
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Tạo URL công khai cho file đã tải lên
    upload[
      "secure_url"
    ] = `https://lh3.googleusercontent.com/d/${upload.data["id"]}`;

    return upload;
  } catch (error) {
    console.log(error);
  }
};

// Hàm để tải một file lên Google Drive
const streamUploadPdf = async (base64) => {
  try {
  
    // Chuyển dữ liệu base64 thành dữ liệu nhị phân
    const binaryData = Buffer.from(base64, "base64");

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

    // Tạo một stream từ dữ liệu nhị phân
    const readableStream = new stream.PassThrough();
    readableStream.end(binaryData);

    // Tải file lên Google Drive
    const upload = await drive.files.create({
      requestBody: {
        name: "CV-GNOUD-" + Date.now().toString() + ".pdf",
        mimeType: "application/pdf",
        parents: ["1-wrUehzAAPZBVeJoWGu0CZ0Skyz8nU_m"],
      },
      media: {
        mimeType: "application/pdf",
        body: readableStream,
      },
    });

    // Đặt quyền truy cập công khai cho file
    await drive.permissions.create({
      fileId: upload.data["id"],
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    
    // Tạo URL công khai cho file đã tải lên
    // upload[
    //   "url_file"
    // ] = `https://drive.google.com/file/d/${upload.data["id"]}/preview`;
    upload["id_file"] = upload.data["id"];
    return upload;
  } catch (error) {
    console.log(error);
  }
};

// Hàm để tải một file
export const uploadSingle = async (buffer: Buffer) => {
  try {
    const result = await streamUpload(buffer);
    return result["secure_url"];
  } catch (error) {
    console.log(error);
  }
};

export const uploadSingleFile = async (buffer: Buffer) => {
  try {
    const result = await streamUploadPdf(buffer);
    return result["id_file"];
  } catch (error) {
    console.log(error);
  }
};

// Hàm để tải nhiều file
export const uploadMultiple = async (arrayBuffer: Buffer[]) => {
  const result = [];
  for (let buffer of arrayBuffer) {
    const link = await streamUpload(buffer);
    result.push(link["secure_url"]);
  }
  return result;
};
