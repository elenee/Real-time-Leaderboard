import { IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
