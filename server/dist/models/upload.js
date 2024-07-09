"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBody = void 0;
const zod_1 = __importDefault(require("zod"));
const uploadBody = zod_1.default.object({
    key: zod_1.default.any(),
    Type: zod_1.default.any(),
    //   file: z.any(),
});
exports.uploadBody = uploadBody;
