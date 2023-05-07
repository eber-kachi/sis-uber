import { AbstractDto } from '../../../common/dto/AbstractDto';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClienteEntity } from '../entities/cliente.entity';
import { UserEntity } from '../../user/user.entity';
import { ViajeEntity } from '../../viajes/entities/viaje.entity';

export class ClienteDto extends AbstractDto {
  @ApiPropertyOptional()
  nombres: string;
  @ApiPropertyOptional()
  apellidos: string;

  @ApiPropertyOptional()
  user: UserEntity;

  @ApiPropertyOptional()
  viajes: ViajeEntity[];

  constructor(entity: ClienteEntity) {
    super(entity);
    this.nombres = entity.nombres;
    this.apellidos = entity.apellidos;
    this.user = entity.user;
    this.viajes = entity.viajes;
  }
}
