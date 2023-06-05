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
import { SocioModule } from './modules/socio/socio.module';
import { VeiculoModule } from './modules/veiculo/veiculo.module';
import { ViajesModule } from './modules/viajes/viajes.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformationInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from 'interceptors/all-exceptions.filter';
import { MapTrakingGateway } from './gateways/map-traking.gateway';

@Module({
  imports: [
    // UserModule,
    // ModulesModule,
    AuthModule,
    UserModule,

    NotificationModule,
    // SchedulesModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    SocioModule,
    VeiculoModule,
    ViajesModule,
    ClienteModule,

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
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformationInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    MapTrakingGateway,
  ],
})
export class AppModule {}
