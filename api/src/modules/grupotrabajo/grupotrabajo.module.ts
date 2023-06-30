import { Module } from '@nestjs/common';
import { GrupotrabajoService } from './grupotrabajo.service';
import { GrupotrabajoController } from './grupotrabajo.controller';
import { GrupotrabajoEntity } from './entities/grupotrabajo.entity';
import { GrupotrabajoRepository } from './grupotrabajo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GrupotrabajoEntity])],
  controllers: [GrupotrabajoController],
  providers: [GrupotrabajoService, GrupotrabajoRepository],
  exports: [GrupotrabajoService],
})
export class GrupotrabajoModule {}
