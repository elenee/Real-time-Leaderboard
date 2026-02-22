import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UsersModule } from 'src/users/users.module';
import { ScoresModule } from 'src/scores/scores.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  imports: [UsersModule, ScoresModule, GamesModule],
})
export class LeaderboardModule {}
