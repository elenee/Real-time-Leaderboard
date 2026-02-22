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
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'

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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
