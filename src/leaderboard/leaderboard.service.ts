import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getLeaderboard(gameId: string, limit: number, userId: string) {
    if (!isValidObjectId(gameId)) {
      throw new BadRequestException('invalid mongo id');
    }
    const topScores = await this.redisService.getTopScores(gameId, limit);

    if (topScores.length === 0) return [];

    const userIds = topScores.map((user) => user.userId);
    const users = await this.userModel.find(
      { _id: { $in: userIds } },
      { username: 1 },
    );

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.username;
      return acc;
    }, {});

    const topPlayers = topScores.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      score: entry.score,
      username: userMap[entry.userId] || 'Unknown player',
    }));

    let currentUser: { rank: number | null; score: number } | null = null;
    if (userId) {
      const targetId = userId.toString();
      const rank = await this.redisService.getUserrank(gameId, targetId);
      const score = await this.redisService.getUserScore(gameId, targetId);
      currentUser = {
        rank: rank,
        score: score ? parseInt(score, 10) : 0,
      };
    }

    return {
      topPlayers,
      currentUser,
    };
  }
}
