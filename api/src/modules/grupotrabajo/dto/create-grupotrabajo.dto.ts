import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { GrupotrabajoEntity } from '../entities/grupotrabajo.entity';
import { SocioEntity } from 'modules/socio/entities/socio.entity';
export class CreateGrupotrabajoDto extends AbstractDto {
  @ApiPropertyOptional()
  nombre: string;
  @ApiPropertyOptional()
  hora_fin: number;
  @ApiPropertyOptional()
  hora_inicio: string;

  @ApiPropertyOptional()
  socios: SocioEntity[];

  constructor(entity: GrupotrabajoEntity) {
    super(entity);
    this.nombre = entity.nombre;
    this.hora_fin = entity.hora_fin;
    this.hora_inicio = entity.hora_inicio;
    this.socios = entity.socios;
  }
}
