import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel('Score') private scoreModel: Model<Score>,
  ) {}

  async submitScore(userId, createScoreDto: CreateScoreDto) {
    const score = await this.scoreModel.create({
      ...createScoreDto,
      gameId: createScoreDto.gameId as any,
      userId,
    });
    return score;
  }

  findAll() {
    return this.scoreModel.find();
  }
}
