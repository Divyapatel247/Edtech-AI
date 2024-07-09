"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// import { string } from "zod";
// import { signinBody } from "../models/user";
const upload_1 = require("../models/upload");
const s3 = new client_s3_1.S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET;
console.log(BUCKET);
const uploadImage = (req, res, err) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, BUCKET);
    const requestBody = upload_1.uploadBody.safeParse(req.body);
    if (!requestBody.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const userDetails = requestBody.data;
    // const key = key;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET,
        Key: userDetails.key,
        // ContentType: "video/*",
    });
    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command);
    res.status(200).json({ url });
    // try {
    //     await s3.send(command);
    //     return { key };
    // } catch (error) {
    //     return { error };
    // }
});
exports.uploadImage = uploadImage;
// const init = async()=>{
//     console.log("Url for :",
//     await uploadImage({imageType:"imageType",key:"abc/12"})
//     )
// }
// init();
// export const uploadVideo = async (req: Request, res: Response, err: any) => {
//     const requestBody = uploadBody.safeParse(req.body);
//     if (!requestBody.success) {
//         return res.status(411).json({
//             message: "Incorrect inputs",
//         });
//     }
//     const userDetails: UploadType = requestBody.data;
//     const command = new PutObjectCommand({
//         Bucket: BUCKET,
//         Key: userDetails.key,
//         Body: userDetails.file.buffer,
//         ContentType: userDetails.Type,
//     });
//     // const url = await getSignedUrl(s3,command);
//     // res.status(200).json({url})
//     try {
//         await s3.send(command);
//         res.status(200).json(userDetails.key);
//     } catch (error) {
//         return { error };
//     }
// };
