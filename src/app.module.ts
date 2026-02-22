import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesModule } from './games/games.module';
import { ScoresModule } from './scores/scores.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UsersModule,
    AuthModule,
    GamesModule,
    ScoresModule,
    RedisModule,
    LeaderboardModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
