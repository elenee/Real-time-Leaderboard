import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { User } from 'src/auth/decorators/user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { ScoresService } from 'src/scores/scores.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private scoresService: ScoresService,
  ) {}

  @Get('global')
  getHighestScores() {
    return this.leaderboardService.getAllHighestScores();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':gameId')
  getLeaderboard(
    @Param('gameId') gameId: string,
    @Query('limit') limit: string,
    @User() userId,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.leaderboardService.getLeaderboard(gameId, limitNum, userId);
  }

  @Get(':gameId/report')
  getTopPlayersReport(@Param('gameId') gameId: string, @Query() query) {
    const { from, to, limit } = query;

    return this.scoresService.playersReport(
      gameId,
      new Date(from),
      new Date(to),
      limit,
    );
  }
}
