import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Score } from './entities/score.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel('Score') private scoreModel: Model<Score>,
    private readonly redisService: RedisService,
  ) {}

  async submitScore(userId, createScoreDto: CreateScoreDto) {
    const score = await this.scoreModel.create({
      ...createScoreDto,
      gameId: createScoreDto.gameId as any,
      userId,
    });

    console.log(userId, createScoreDto.gameId, createScoreDto.score);
    await this.redisService.addScore(
      userId,
      createScoreDto.gameId,
      createScoreDto.score,
    );
    return score;
  }

  findAll() {
    return this.scoreModel.find();
  }
}
