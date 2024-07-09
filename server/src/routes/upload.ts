import { IRouter } from "express";
import express from "express";
import { uploadImage } from "../controllers/upload";

const router: IRouter = express.Router();

//UPLOAD THUMBNAIL
router.post("/image", uploadImage);

//UPLOAD VIDEO
// router.post("/video", uploadVideo);

export default router;
