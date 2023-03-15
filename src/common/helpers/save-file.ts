import { extname, parse } from 'path';
import * as fs from 'fs';

import { SaveFileData, UploadedFiles } from '@common/models';

import { v4 as uuid } from 'uuid';
import * as BPromise from 'bluebird';

export class SaveFile {
  public static saveFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<SaveFileData> {
    const ext = extname(file.originalname);

    const directory = 'uploads';
    const replaceDirectory = 'public';
    const { name: originalName } = parse(file.originalname);
    const fileName = `${originalName}_${uuid()}${ext}`;
    let filePath = `${directory}/${fileName}`;
    if (folder) {
      filePath = `${directory}/${folder}/${fileName}`;
    }
    const fullDirectory = filePath;
    return new Promise((resolve, reject) => {
      const folders = fullDirectory.split('/');
      folders.reduce((dir, curr, index) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        if (index != folder.length - 1) {
          dir += '/' + curr;
        }
        return dir;
      });
      fs.writeFile(filePath, file.buffer, { flag: 'w+' }, async (err) => {
        if (err) {
          reject(err);
        }
        const fileData = {
          path: filePath.replace(directory, replaceDirectory),
          mimeType: file.mimetype,
          size: file.size,
        };
        resolve(fileData);
      });
    });
  }

  public static async saveMultipleFiles<T>(
    uploadedFiles: UploadedFiles<T>,
    folder: string,
  ): Promise<T> {
    const filePaths: T = {} as T;
    for (const fileKey of Object.keys(uploadedFiles)) {
      await BPromise.map(uploadedFiles[fileKey], async (file) => {
        if (uploadedFiles[fileKey].length === 1) {
          filePaths[fileKey] = await SaveFile.saveFile(file, folder);
        } else {
          if (!filePaths[fileKey]) {
            filePaths[fileKey] = [];
          }
          filePaths[fileKey].push(await SaveFile.saveFile(file, folder));
        }
      });
    }
    return filePaths;
  }
}
