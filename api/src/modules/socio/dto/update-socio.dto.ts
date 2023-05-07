import { PartialType } from '@nestjs/swagger';
import { SocioDto } from './create-socio.dto';

export class UpdateSocioDto extends PartialType(SocioDto) {}
