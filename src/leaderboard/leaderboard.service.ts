import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Game } from 'src/games/entities/game.entity';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Game') private gameModel: Model<Game>,
  ) {}

  async getAllHighestScores() {
    const allTopScores = await this.redisService.getAllGamesTopScores();

    const gameIds = allTopScores.map((game) => game.gameId);
    const games = await this.gameModel.find(
      { _id: { $in: gameIds } },
      { name: 1 },
    );
    const gameMap = games.reduce((acc, game) => {
      acc[game._id.toString()] = game.name;
      return acc;
    }, {});

    const userIds = allTopScores.flatMap((entry) =>
      entry.topScores.map((user) => user.userId),
    );
    const users = await this.userModel.find(
      { _id: { $in: userIds } },
      { username: 1 },
    );

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.username;
      return acc;
    }, {});

    const topPlayers = allTopScores
      .flatMap((entry) =>
        entry.topScores.map((score) => ({
          userId: score.userId,
          userName: userMap[score.userId],
          score: score.score,
          game: gameMap[entry.gameId],
        })),
      )
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ rank: index + 1, ...entry }));

    return topPlayers;
  }

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
