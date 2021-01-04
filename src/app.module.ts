import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forRoot('mongodb://carfax-db/carfax'),
    BullModule.forRoot({
      redis: {
        host: 'carfax-redis',
        port: 6379,
      },
    }),
    UtilModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
