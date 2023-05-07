'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SocioEntity } from '../entities/socio.entity';
import { AbstractDto } from '../../../common/dto/AbstractDto';

export class SocioDto extends AbstractDto {
  @ApiPropertyOptional()
  nombres: string;
  @ApiPropertyOptional()
  apellidos: string;
  @ApiPropertyOptional()
  ci: string;
  @ApiPropertyOptional()
  nacionalidad: string;
  @ApiPropertyOptional()
  foto: string;
  @ApiPropertyOptional()
  estado: string;

  // licencia
  @ApiPropertyOptional()
  emision: Date;

  @ApiPropertyOptional()
  vencimiento: Date;

  @ApiPropertyOptional()
  nroLicencia: string;

  @ApiPropertyOptional()
  categoria: string;

  constructor(entity: SocioEntity) {
    super(entity);
    this.nombres = entity.nombres;
    this.apellidos = entity.apellidos;
    this.ci = entity.ci;
    this.nacionalidad = entity.nacionalidad;
    this.foto = entity.foto;
    this.estado = entity.estado;
    this.emision = entity.emision;
    this.vencimiento = entity.vencimiento;
    this.nroLicencia = entity.nroLicencia;
    this.categoria = entity.categoria;
  }
}
