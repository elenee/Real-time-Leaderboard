import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { User } from 'src/auth/decorators/user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  findAll() {}
  getHighestScores() {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':gameId')
  getLeaderboard(
    @Param('gameId') gameId: string,
    @Query('limit') limit: string,
    @User() userId,
  ) {
    console.log('User from Decorator:', userId);
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.leaderboardService.getLeaderboard(gameId, limitNum, userId);
  }
}
