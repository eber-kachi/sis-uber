import { PartialType } from '@nestjs/swagger';
import { ViajeDto } from './create-viaje.dto';

export class UpdateViajeDto extends PartialType(ViajeDto) {}
