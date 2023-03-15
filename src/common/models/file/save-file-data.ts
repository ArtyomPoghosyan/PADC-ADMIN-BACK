export interface SaveFileData {
  path: string;
  mimeType: string;
  size: number;
  [key: string]: string | number | any;
}
