import { DataSource, Repository } from 'typeorm';
import { VeiculoEntity } from './entities/veiculo.entity';
// import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Injectable } from '@nestjs/common';

// @EntityRepository(VeiculoEntity)
// export class VeiculoRepository extends Repository<VeiculoEntity> {}

@Injectable()
export class VeiculoRepository extends Repository<VeiculoEntity> {
  constructor(private dataSource: DataSource) {
    super(VeiculoEntity, dataSource.createEntityManager());
  }
}
