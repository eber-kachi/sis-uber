import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { MedicTaskDto } from './MedicTaskDto';

@Entity({ name: 'medicoestado' })
export class MedicTaskEntity extends AbstractEntity<MedicTaskDto> {
  @Column({ nullable: true, type: 'datetime' })
  fecha: Date;

  dtoClass = MedicTaskDto;

}
