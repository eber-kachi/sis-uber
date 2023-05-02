import { EntityRepository, Repository } from 'typeorm';
import { MedicTaskEntity } from './medic-task.entity';

@EntityRepository(MedicTaskEntity)
export class MedicTaskRepository extends Repository<MedicTaskEntity> {
}
