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
exports.getUploadedObj = exports.uploadVideo = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const upload_1 = require("../models/upload");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const s3 = new client_s3_1.S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET;
console.log(BUCKET);
const uploadVideo = (req, res, err) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, BUCKET);
    const requestBody = upload_1.uploadBody.safeParse(req.body);
    if (!requestBody.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const userDetails = requestBody.data;
    const userId = req.user.id;
    // const key = key;
    const setKey = yield prisma.video.create({
        data: {
            key: userDetails.key,
            userId: userId,
        },
    });
    console.log(setKey);
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
exports.uploadVideo = uploadVideo;
const getUploadedObj = (req, res, err) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.ListObjectsV2Command({
        Bucket: "process-videos-edtechai-247",
        Prefix: "processed/",
        Delimiter: "/index.m3u8",
    });
    // const { Contents = [] } = await s3.send(command);
    // console.log(Contents);
    s3.send(command, (err, data) => {
        if (err) {
            console.error("Error", err);
        }
        else {
            // Extract the CommonPrefixes to get the subfolder keys
            let subfolderKeys = ((data === null || data === void 0 ? void 0 : data.CommonPrefixes) || [])
                .map((prefix) => prefix.Prefix)
                .filter(Boolean);
            subfolderKeys = subfolderKeys.map((str) => str === null || str === void 0 ? void 0 : str.split("/")[1]);
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
});
exports.getUploadedObj = getUploadedObj;
// const init = async () => {
//   console.log("video key  for :", await getUploadedObj());
// };
// init();
