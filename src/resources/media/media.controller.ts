import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@common/pipes';
import { UploadedFiles as UploadedFilesType } from '@common/models';
import { ParamsDto } from './dto';

@Controller('media')
export class MediaController {
  constructor(private readonly _mediaService: MediaService) {}

  @Post('home/video')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]))
  public uploadHomeVideo(
    @UploadedFiles(
      new FileValidationPipe()
        .addRequiredFileFields([{ fileKey: 'video' }])
        .addSizeValidation(1)
        .addAcceptedFileExtentions([
          'image/png',
          'image/jpg',
          'image/jpeg',
          'video/mp4',
          'video/avi',
          'video/mov',
          'video/wmv',
          'video/flv',
          'video/mkv',
        ]),
    )
    files: UploadedFilesType<{ video: Express.Multer.File }>,
  ) {
    return this._mediaService.uploadHomeVideo(files);
  }

  @Post('slider')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 30 }]))
  public uploadSlider(
    @UploadedFiles(
      new FileValidationPipe()
        .addRequiredFileFields([{ fileKey: 'files' }])
        .addSizeValidation(30)
        .addAcceptedFileExtentions([
          'image/png',
          'image/jpg',
          'image/jpeg',
          'video/mp4',
          'video/avi',
          'video/mov',
          'video/wmv',
          'video/flv',
          'video/mkv',
        ]),
    )
    files: UploadedFilesType<{ files: Express.Multer.File }>,
  ) {
    return this._mediaService.uploadSlider(files);
  }

  @Get('home/video')
  public getHomeVideo() {
    return this._mediaService.getHomeVideo();
  }

  @Get('slider')
  public getSliders() {
    return this._mediaService.getSliders();
  }

  @Delete('home/video:id')
  public deleteHomeVideo(@Param() params: ParamsDto) {
    return this._mediaService.deleteHomeVideo(params.id);
  }

  @Delete('slider/:id')
  public deleteSlider(@Param() params: ParamsDto) {
    return this._mediaService.deleteSlider(params.id);
  }
}
