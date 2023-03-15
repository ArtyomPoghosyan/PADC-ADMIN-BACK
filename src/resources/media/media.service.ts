import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeFile, Sliders } from '@common/database/entities';
import { Repository } from 'typeorm';
import { UploadedFiles } from '@common/models';
import { buildResponse, SaveFile } from '@common/helpers';
import * as BPromise from 'bluebird';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(HomeFile)
    private _homeFileRepository: Repository<HomeFile>,
    @InjectRepository(Sliders)
    private _slidersRepository: Repository<Sliders>,
  ) {}

  public async uploadHomeVideo(
    files: UploadedFiles<{ video: Express.Multer.File }>,
  ) {
    try {
      const filePaths = await SaveFile.saveMultipleFiles(files, `home`);

      await this._homeFileRepository.update(1, {
        path: filePaths.video.path,
      });

      return buildResponse(true, {});
    } catch (e) {
      throw e;
    }
  }

  public async uploadSlider(
    files: UploadedFiles<{ files: Express.Multer.File }>,
  ) {
    try {
      const filePaths = await SaveFile.saveMultipleFiles(files, `slider`);

      for (const key of Object.keys(filePaths)) {
        if (filePaths[key].length) {
          await BPromise.map(filePaths[key], async (file) => {
            await this._slidersRepository.save({
              path: file.path,
            });
          });
        }
      }

      return buildResponse(true, {});
    } catch (e) {
      throw e;
    }
  }

  public async getHomeVideo() {
    try {
      const data = await this._homeFileRepository.findOne({});

      if (!data) {
        throw buildResponse(false, {
          message: ['Home video not found'],
        });
      }

      return buildResponse(true, data);
    } catch (e) {
      throw e;
    }
  }

  public async getSliders() {
    try {
      const data = await this._slidersRepository.find({});

      if (!data) {
        throw buildResponse(false, {
          message: ['Sliders not found'],
        });
      }

      return buildResponse(true, data);
    } catch (e) {
      throw e;
    }
  }

  public async deleteSlider(id: number) {
    try {
      const data = await this._slidersRepository.findOneBy({ id });

      if (!data) {
        throw buildResponse(false, {
          message: ['Slider not found'],
        });
      }

      await this._slidersRepository.delete(data.id);

      return buildResponse(true, {});
    } catch (e) {
      throw e;
    }
  }

  public async deleteHomeVideo(id: number) {
    try {
      const data = await this._homeFileRepository.findOneBy({ id });

      if (!data) {
        throw buildResponse(false, {
          message: ['Home video not found'],
        });
      }

      await this._homeFileRepository.delete(data.id);

      return buildResponse(true, {});
    } catch (e) {
      throw e;
    }
  }
}
