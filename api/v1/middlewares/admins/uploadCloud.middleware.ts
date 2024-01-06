import { Request, Response } from "express";

import * as uploadToCloudinary from "../../../../helpers/uploadToCloudinary"

//Hàm này sử lý logic
export const uplloadReact = async (req: Request, res: Response, next: any): Promise<void> => {
   
    if (req.body["thumbUrl"]) {
        //Chuyển base64 thành buffe
       
        try {
            const buffer = Buffer.from(req.body.thumbUrl, 'base64');
            const link = await uploadToCloudinary.uploadSingle(buffer);
            //req.file.fieldname nó lấy cái key là thumnail
            req.body["thumbUrl"] = link;
        } catch (error) {
            console.error("ok");
        }
    }
    next()
}
export const uplloadTiny = async (req: Request, res: Response, next: any): Promise<void> => {
    if (req["file"]) {
        try {
            const link = await uploadToCloudinary.uploadSingle(req["file"].buffer);
            //req.file.fieldname nó lấy cái key là thumnail
            req.body[req["file"].fieldname] = link;
        } catch (error) {
            console.error(error);
        }
    }
    next()
}