/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { SocioEntity } from './entities/socio.entity';
@EntityRepository(SocioEntity)
export class SocioRepository extends Repository<SocioEntity> {}
