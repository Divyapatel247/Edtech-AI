import {
  // GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadType, uploadBody } from "../models/upload";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET;
console.log(BUCKET);

export const uploadVideo = async (req: Request, res: Response, err: any) => {
  console.log(req.body, BUCKET);
  const requestBody = uploadBody.safeParse(req.body);

  if (!requestBody.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const userDetails: UploadType = requestBody.data;
  const userId = (req.user as any).id;
  // const key = key;
  const setKey = await prisma.video.create({
    data: {
      key: userDetails.key,
      userId: userId,
    },
  });
  console.log(setKey);
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

export const getUploadedObj = async (req: Request, res: Response, err: any) => {
  const command = new ListObjectsV2Command({
    Bucket: "process-videos-edtechai-247",
    Prefix: "processed/",
    Delimiter: "/index.m3u8",
  });

  // const { Contents = [] } = await s3.send(command);
  // console.log(Contents);
  s3.send(command, (err, data) => {
    if (err) {
      console.error("Error", err);
    } else {
      // Extract the CommonPrefixes to get the subfolder keys
      let subfolderKeys = (data?.CommonPrefixes || [])
        .map((prefix) => prefix.Prefix)
        .filter(Boolean);
      subfolderKeys = subfolderKeys.map((str) => str?.split("/")[1]);
      console.log(subfolderKeys);
      res.status(200).json({ subfolderKeys });
      // setSubfolders(subfolderKeys);
    }
  });

  // const command = {
  //   Bucket: BUCKET,
  //   Prefix: "processed/",
  // };
  // console.log(req.body)

  // ListObjectsV2Command(s3, command, (err, data) => {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     const objects = data.Contents.map((object: { Key: any }) => ({
  //       key: object.Key,
  //     }));
  //     console.log(objects);
  //     // return objects;
  //   }
  // });
};
// const init = async () => {
//   console.log("video key  for :", await getUploadedObj());
// };
// init();
