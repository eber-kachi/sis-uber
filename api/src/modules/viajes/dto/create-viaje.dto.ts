'use strict';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeEntity } from '../entities/viaje.entity';
// import { ClienteEntity } from '../../cliente/entities/cliente.entity';
// import { SocioEntity } from '../../socio/entities/socio.entity';

export class ViajeDto extends AbstractDto {
  @ApiPropertyOptional()
  distancia_recorrida: string;
  @ApiPropertyOptional()
  fecha: string;
  @ApiPropertyOptional()
  estado: string;
  @ApiPropertyOptional()
  calificacion: number;

  //   @ApiPropertyOptional()
  //   cliente?: ClienteEntity;

  //   @ApiPropertyOptional()
  //   socio?: SocioEntity;

  constructor(entity: ViajeEntity) {
    super(entity);
    this.distancia_recorrida = entity.distancia_recorrida;
    this.fecha = entity.fecha;
    this.estado = entity.estado;
    this.calificacion = entity.calificacion;
    // this.cliente = entity.cliente;
    // this.socio = entity.socio;
  }
}
