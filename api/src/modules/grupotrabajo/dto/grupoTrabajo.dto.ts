import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { GrupotrabajoEntity } from '../entities/grupotrabajo.entity';

export class GrupoTrabajoDTO extends AbstractDto {
  @ApiPropertyOptional()
  nombre: string;

  @ApiPropertyOptional()
  hora_inicio: string;

  @ApiPropertyOptional()
  hora_fin: string;

  constructor(entity: GrupotrabajoEntity) {
    super(entity);
    this.nombre = entity.nombre;
    this.hora_inicio = entity.hora_inicio;
    this.hora_fin = entity.hora_fin;
  }
}
