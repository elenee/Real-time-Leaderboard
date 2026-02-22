import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

export interface LeaderboardEntry {
  userId: string;
  score: number;
}

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async ping() {
    return await this.redis.ping();
  }

  async addScore(userId: string, gameId: string, score: number) {
    return await this.redis.zadd(`leaderboard:${gameId}`, 'GT', score, userId);
  }

  async getTopScores(gameId: string, limit: number = 10) {
    const key = `leaderboard:${gameId}`;

    const rawResults = await this.redis.zrevrange(
      key,
      0,
      limit - 1,
      'WITHSCORES',
    );

    const results: LeaderboardEntry[] = [];

    for (let i = 0; i < rawResults.length; i += 2) {
      results.push({
        userId: rawResults[i],
        score: parseInt(rawResults[i + 1], 10),
      });
    }
    return results;
  }

  async getUserrank(gameId: string, userId: string) {
    const key = `leaderboard:${gameId}`;
    const rank = await this.redis.zrevrank(key, userId);

    if (rank === null) return null;
    return rank + 1;
  }

  async getUserScore(gameId: string, userId: string) {
    const key = `leaderboard:${gameId}`;
    return await this.redis.zscore(key, userId);
  }

  async removePlayer(gameId: string, userId: string) {
    const key = `leaderboard:${gameId}`;

    return await this.redis.zrem(key, userId);
  }

  async getAllKeys() {
    return this.redis.keys('leaderboard:*');
  }

  async getAllGamesTopScores() {
    const keys = await this.getAllKeys();
    const leaderboard: any = [];
    for (const key of keys) {
      const [gameId] = key.split(':').splice(-1);
      const topScores = await this.getTopScores(gameId, 10);
      leaderboard.push({ gameId, topScores });
    }
    return leaderboard;
  }
}
