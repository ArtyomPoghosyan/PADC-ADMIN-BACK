import { MB_IN_BYTES } from '@common/constants';
import { buildResponse } from '@common/helpers';
import { IRequiredFileField, UploadedFiles } from '@common/models';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileValidationPipe<T> implements PipeTransform {
  private _maxFileSize: number;
  private _acceptedFiles: string[] = [];
  private _requiredFileFields: IRequiredFileField[] = [];

  constructor() {
    this._maxFileSize = MB_IN_BYTES;
    this._acceptedFiles = [];
    this._requiredFileFields = [];
  }

  private _validateFile(files: UploadedFiles<T>): UploadedFiles<T> {
    const fileKeys = Object.keys(files || {});
    const errorFields: { [k in keyof T]: string } = {} as {
      [k in keyof T]: string;
    };

    let isValid = true;
    if (this._requiredFileFields.length) {
      this._requiredFileFields.forEach((fileField) => {
        const isFileExists = fileKeys.some((e) => fileField.fileKey === e);
        if (!isFileExists) {
          errorFields[fileField.fileKey] = `${fileField.fileKey} is required`;
          isValid = false;
        } else if (this._acceptedFiles.length) {
          const isFileHasCorrectMimeType = this._acceptedFiles.some(
            (e) => e === files[fileField.fileKey][0].mimetype,
          );
          if (!isFileHasCorrectMimeType) {
            errorFields[
              fileField.fileKey
            ] = `${fileField.fileKey} is not accepted`;
            isValid = false;
          }
        } else if (this._maxFileSize) {
          const isSizeValid =
            files[fileField.fileKey][0].size < this._maxFileSize;
          if (!isSizeValid) {
            errorFields[fileField.fileKey] = `The maxium size for ${
              fileField.fileKey
            } is ${(this._maxFileSize / MB_IN_BYTES).toFixed(2)} MB`;
            isValid = false;
          }
        }
      });
    }
    if (!isValid) {
      throw buildResponse(false, {
        message: Object.values(errorFields),
      });
    }
    return files;
  }

  public addSizeValidation(maxFileSize: number): FileValidationPipe<T> {
    this._maxFileSize = maxFileSize * MB_IN_BYTES;
    return this;
  }

  public addAcceptedFileExtentions(
    acceptedFileExtentions: string[],
  ): FileValidationPipe<T> {
    this._acceptedFiles = acceptedFileExtentions;
    return this;
  }

  public addRequiredFileFields(
    requiredFileFields: IRequiredFileField[],
  ): FileValidationPipe<T> {
    this._requiredFileFields = requiredFileFields;
    return this;
  }

  transform(value: UploadedFiles<T>, _: ArgumentMetadata): UploadedFiles<T> {
    return this._validateFile(value);
  }
}
