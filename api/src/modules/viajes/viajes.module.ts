import { forwardRef, Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeRepository } from './viajes.repository';

import { SocioModule } from '../socio/socio.module';


@Module({
  imports: [forwardRef(() => SocioModule), TypeOrmModule.forFeature([ViajeRepository])],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule {
}
