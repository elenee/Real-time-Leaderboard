import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}
