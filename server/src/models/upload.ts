import z from "zod";

const uploadBody = z.object({
  key: z.any(),
  Type: z.any(),
  //   file: z.any(),
});
type UploadType = z.infer<typeof uploadBody>;
export { UploadType, uploadBody };
