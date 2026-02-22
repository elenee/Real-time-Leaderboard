import { Inject, Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Score } from './entities/score.entity';
import { RedisService } from 'src/redis/redis.service';
import { AppGateway } from 'src/gateway/gateway.gateway';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel('Score') private scoreModel: Model<Score>,
    @Inject() private readonly appGateway: AppGateway,
    private readonly redisService: RedisService,
  ) {}

  async submitScore(userId, createScoreDto: CreateScoreDto) {
    const score = await this.scoreModel.create({
      ...createScoreDto,
      gameId: createScoreDto.gameId as any,
      userId,
    });

    await this.redisService.addScore(
      userId,
      createScoreDto.gameId,
      createScoreDto.score,
    );

    await this.appGateway.emitLeaderboardUpdate(
      createScoreDto.gameId,
      await this.redisService.getTopScores(createScoreDto.gameId, 10),
    );

    return score;
  }

  findAll() {
    return this.scoreModel.find();
  }

  async playersReport(gameId: string, from: Date, to: Date, limit: string) {
    return this.scoreModel.aggregate([
      {
        $match: {
          gameId: new Types.ObjectId(gameId),
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: '$userId',
          topScore: { $max: '$score' },
        },
      },
      { $sort: { topScore: -1 } },
      { $limit: limit ? parseInt(limit, 10) : 10 },
    ]);
  }
}
