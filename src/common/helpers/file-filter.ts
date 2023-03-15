export function filterImagesOnly(
  req: any,
  file: Partial<Express.Multer.File>,
): boolean {
  if (!file.originalname.match(/.*\.(jpe?g|bmp|png)$/gim)) {
    req.fileUploadError = 'Invalid file format';
    return false;
  } else {
    return true;
  }
}
