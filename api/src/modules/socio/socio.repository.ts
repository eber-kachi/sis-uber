/* eslint-disable prettier/prettier */
import { DataSource, Repository } from 'typeorm';
import { SocioEntity } from './entities/socio.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocioRepository extends Repository<SocioEntity> {
  constructor(private dataSource: DataSource) {
    super(SocioEntity, dataSource.createEntityManager());
  }
}
