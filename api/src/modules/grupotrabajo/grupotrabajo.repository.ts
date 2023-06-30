import { GrupotrabajoEntity } from './entities/grupotrabajo.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GrupotrabajoRepository extends Repository<GrupotrabajoEntity> {
  constructor(private dataSource: DataSource) {
    super(GrupotrabajoEntity, dataSource.createEntityManager());
  }
}
