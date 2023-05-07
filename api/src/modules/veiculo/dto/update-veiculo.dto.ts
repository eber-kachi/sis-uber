import { PartialType } from '@nestjs/swagger';
import { VeiculoDto } from './create-veiculo.dto';

export class UpdateVeiculoDto extends PartialType(VeiculoDto) {}
