/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ViajeEntity } from './entities/viaje.entity';
@EntityRepository(ViajeEntity)
export class ViajeRepository extends Repository<ViajeEntity> {}
