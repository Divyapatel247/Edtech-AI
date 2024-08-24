"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../controllers/upload");
const verifyToken_1 = require("../verifyToken");
const router = express_1.default.Router();
//UPLOAD THUMBNAIL
router.post("/image", verifyToken_1.verifyToken, upload_1.uploadVideo);
router.get("/getvideos", upload_1.getUploadedObj);
//UPLOAD VIDEO
// router.post("/video", uploadVideo);
exports.default = router;
