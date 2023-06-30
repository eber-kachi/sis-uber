import { PartialType } from '@nestjs/swagger';
import { CreateGrupotrabajoDto } from './create-grupotrabajo.dto';

export class UpdateGrupotrabajoDto extends PartialType(CreateGrupotrabajoDto) {}
