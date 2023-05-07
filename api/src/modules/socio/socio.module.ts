import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioRepository } from './socio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SocioRepository])],
  controllers: [SocioController],
  providers: [SocioService],
  exports: [SocioService],
})
export class SocioModule {}
