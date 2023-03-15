import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateDto, ParamsDto } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '@common/pipes';
import { UploadedFiles as UploadedFilesType } from '@common/models';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  public createUser(
    @Body() body: CreateDto,
    @UploadedFiles(
      new FileValidationPipe()
        .addRequiredFileFields([{ fileKey: 'avatar' }])
        .addSizeValidation(1)
        .addAcceptedFileExtentions(['image/png', 'image/jpg', 'image/jpeg']),
    )
    files: UploadedFilesType<{ avatar: Express.Multer.File }>,
  ) {
    return this._userService.createUser(body, files);
  }

  @Get('/all')
  public getAllUsers() {
    return this._userService.getAllUsers();
  }

  @Get('/:id')
  public getUserById(@Param() params: ParamsDto) {
    return this._userService.getUserById(params.id);
  }

  @Delete('/:id')
  public deleteUserById(@Param() params: ParamsDto) {
    return this._userService.deleteUserById(params.id);
  }
}
