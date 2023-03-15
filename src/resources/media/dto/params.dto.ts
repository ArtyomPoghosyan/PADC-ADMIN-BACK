import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ParamsDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}
