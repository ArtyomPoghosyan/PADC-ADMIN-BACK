import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeFile, Sliders } from '@common/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([HomeFile, Sliders])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
