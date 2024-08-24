import { IRouter } from "express";
import express from "express";
import { getUploadedObj, uploadVideo } from "../controllers/upload";
import { verifyToken } from "../verifyToken";

const router: IRouter = express.Router();

//UPLOAD THUMBNAIL
router.post("/image", verifyToken, uploadVideo);
router.get("/getvideos", getUploadedObj);
//UPLOAD VIDEO
// router.post("/video", uploadVideo);

export default router;
