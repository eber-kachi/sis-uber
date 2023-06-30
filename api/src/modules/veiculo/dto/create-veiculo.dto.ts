import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VeiculoEntity } from '../entities/veiculo.entity';

export class VeiculoDto extends AbstractDto {
  @ApiPropertyOptional()
  socio_id: string;
  @ApiPropertyOptional()
  placa: string;
  @ApiPropertyOptional()
  modelo: string;
  @ApiPropertyOptional()
  marca: string;
  @ApiPropertyOptional()
  color: string;
  @ApiPropertyOptional()
  foto: string;
  @ApiPropertyOptional()
  capacidad: string;
  @ApiPropertyOptional()
  caracteristicas: string;
  @ApiPropertyOptional()
  anio: string;
  @ApiPropertyOptional()
  n_movil: string;

  constructor(entity: VeiculoEntity) {
    super(entity);
    this.placa = entity.placa;
    this.modelo = entity.modelo;
    this.marca = entity.marca;
    this.color = entity.color;
    this.foto = entity.foto;
    this.capacidad = entity.capacidad;
    this.caracteristicas = entity.caracteristicas;
    this.anio = entity.anio;
    this.n_movil = entity.n_movil;
  }
}
