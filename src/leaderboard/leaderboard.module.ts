import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  imports: [UsersModule]
})
export class LeaderboardModule {}
