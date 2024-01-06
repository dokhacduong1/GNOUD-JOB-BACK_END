
import CryptoJS from "crypto-js"
import dotenv from "dotenv"
dotenv.config()

const secretKey = process.env.SECRET_KEY;

//Đây là hàm mã hóa dữ liệu về một  dạng mã hóa đối xứng AES (Advanced Encyption Standard)
export function encryptedData(data: any) : string {
    // Encrypt
    var ciphertext : string = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return ciphertext;
}