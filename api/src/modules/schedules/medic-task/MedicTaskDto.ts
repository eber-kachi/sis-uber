import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MedicTaskEntity } from './medic-task.entity';


export class MedicTaskDto extends AbstractDto {
  @ApiPropertyOptional()
  fecha: Date;

  constructor(medi: MedicTaskEntity) {
    super(medi);
    this.fecha = medi.fecha;
  }
}
