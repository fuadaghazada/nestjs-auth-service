import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from './auth.constant';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './utils/auth.processor';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    BullModule.registerQueue({
      name: 'email'
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: 'carfax-redis',
          port: 6379,
        };
      },
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    EmailProcessor
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
