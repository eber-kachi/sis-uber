import './boilerplate.polyfill';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './shared/services/config.service';
// import { ModulesModule } from './modules/modules.module';

import { NotificationModule } from './modules/notification/notification.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    // UserModule,
    // ModulesModule,
    AuthModule,
    UserModule,

    NotificationModule,
    SchedulesModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'ticket',
    //   entities: [__dirname+'./**/**/*entity{.ts,.js}'],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
