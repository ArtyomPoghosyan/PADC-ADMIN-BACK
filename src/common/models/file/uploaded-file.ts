export type UploadedFiles<T> = {
  [key in keyof T]: Express.Multer.File[];
};
