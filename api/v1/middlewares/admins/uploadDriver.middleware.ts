import { Request, Response } from "express";

import * as uploadToDriver from "../../../../helpers/uploadToDriver"


//Hàm này sử lý logic
export const uplloadReact = async (req: Request, res: Response, next: any): Promise<void> => {
    if (req.body["thumbUrl"]) {
        //Chuyển base64 thành buffe
        try {
            const buffer = req.body.thumbUrl;
        
            const link = await uploadToDriver.uploadSingle(buffer);

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
            const link = await uploadToDriver.uploadSingle(req["file"].buffer);
            //req.file.fieldname nó lấy cái key là thumnail
            req.body[req["file"].fieldname] = link;
        } catch (error) {
            console.error(error);
        }
    }
    next()
}

export const uplloadReactPdf = async (req: Request, res: Response, next: any): Promise<void> => {
    if (req.body["file"]) {
        //Chuyển base64 thành buffe
        try {
            const buffer = req.body["file"];
        
            const link = await uploadToDriver.uploadSingleFile(buffer);
          
            //req.file.fieldname nó lấy cái key là thumnail
            req.body["file"] = link;
        } catch (error) {
            console.error("ok");
        }
    }
    next()
}
