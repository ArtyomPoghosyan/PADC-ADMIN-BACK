import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@common/database/entities';
import { Repository } from 'typeorm';
import { CreateDto } from './dto';
import { buildResponse, SaveFile } from '@common/helpers';
import { UploadedFiles } from '@common/models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
  ) {}

  public async createUser(
    body: CreateDto,
    files: UploadedFiles<{ avatar: Express.Multer.File }>,
  ) {
    try {
      const user: User = await this._usersRepository.save({
        firstName: body.firstName,
        lastName: body.lastName,
        position: body.position,
      });

      if (files) {
        const filePaths = await SaveFile.saveMultipleFiles(
          files,
          `user_${user.id}`,
        );

        await this._usersRepository.update(user.id, {
          avatar: filePaths.avatar.path,
        });
      }

      return buildResponse(true, user);
    } catch (e) {
      throw e;
    }
  }

  public async getAllUsers() {
    try {
      const users = await this._usersRepository.find({});

      return buildResponse(true, users);
    } catch (e) {
      throw e;
    }
  }

  public async getUserById(id: number) {
    try {
      const user = await this._usersRepository.findOneBy({ id: Number(id) });

      if (!user) {
        throw buildResponse(false, {
          message: ['User not found'],
        });
      }

      return buildResponse(true, user);
    } catch (e) {
      throw e;
    }
  }

  public async deleteUserById(id: number) {
    try {
      const user = await this._usersRepository.findOneBy({ id: Number(id) });

      if (!user) {
        return buildResponse(false, {
          message: ['User not found'],
        });
      }

      await this._usersRepository.delete(user.id);

      return buildResponse(true, {});
    } catch (e) {
      throw e;
    }
  }
}
