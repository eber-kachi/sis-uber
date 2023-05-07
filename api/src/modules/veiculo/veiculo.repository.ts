import { Repository } from 'typeorm';
import { VeiculoEntity } from './entities/veiculo.entity';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(VeiculoEntity)
export class VeiculoRepository extends Repository<VeiculoEntity> {}
