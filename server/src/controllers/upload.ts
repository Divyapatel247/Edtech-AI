import {
  // GetObjectCommand,
  // ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { string } from "zod";
// import { signinBody } from "../models/user";
import { UploadType, uploadBody } from "../models/upload";

const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET;
console.log(BUCKET);

export const uploadImage = async (req: Request, res: Response, err: any) => {
  console.log(req.body, BUCKET);
  const requestBody = uploadBody.safeParse(req.body);

  if (!requestBody.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const userDetails: UploadType = requestBody.data;
  // const key = key;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: userDetails.key,
    // ContentType: "video/*",
  });

  const url = await getSignedUrl(s3, command);
  res.status(200).json({ url });
  // try {
  //     await s3.send(command);
  //     return { key };
  // } catch (error) {
  //     return { error };
  // }
};

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
