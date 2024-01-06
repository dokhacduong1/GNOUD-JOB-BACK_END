
import cloudinaryOk from "cloudinary"
const cloudinary = cloudinaryOk.v2;
import streamifier from "streamifier"
import { configClound } from "../config/cloudinary"

//Set config cho nó
cloudinary.config(configClound.configCloudinary);
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        try {
           
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });

            streamifier.createReadStream(buffer).pipe(stream);
        } catch (error) {
            console.log("ok")
        }

    });
};
//Upload 1 file
export const uploadSingle = async (buffer: Buffer) => {
    try {
        const result = await streamUpload(buffer);

        return result["secure_url"];
    } catch (error) {
        console.log("ok")
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
