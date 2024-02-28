import dotenv from "dotenv"
import imgur from "imgur"

//Import cấu hình file .env
dotenv.config()



const streamUpload = async (buffer) => {
    imgur.setClientId(process.env.IMGUR_CLIENT_ID);
    const upload = await imgur.uploadBase64(buffer);
    upload["secure_url"] = upload.link;
    return upload;
}

//Upload 1 file
export const uploadSingle = async (buffer: Buffer) => {
    try {
        const result = await streamUpload(buffer);
        
        return result["secure_url"];
    } catch (error) {
        console.log(error)
    }

}

//Upload nhiều file
export const uploadMultiple = async (arrayBuffer: Buffer[]) => {
    const result = [];
    for (let buffer of arrayBuffer) {
        const link = await streamUpload(buffer);
        result.push(link["secure_url"]);
    }
    return result;
}
