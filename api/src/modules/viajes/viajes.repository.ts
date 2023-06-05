/* eslint-disable prettier/prettier */
import { DataSource, Repository } from 'typeorm';
// import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ViajeEntity } from './entities/viaje.entity';
import { Injectable } from '@nestjs/common';
// @EntityRepository(ViajeEntity)
// export class ViajeRepository extends Repository<ViajeEntity> {}

@Injectable()
export class ViajeRepository extends Repository<ViajeEntity> {
  constructor(private dataSource: DataSource) {
    super(ViajeEntity, dataSource.createEntityManager());
  }
}
