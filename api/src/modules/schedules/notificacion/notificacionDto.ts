import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificacionEntity } from './notificacion.entity';

export class NotificacionDto extends AbstractDto {
  @ApiPropertyOptional()
  mensaje: string;

  @ApiPropertyOptional()
  numero: string;

  @ApiPropertyOptional()
  intentos: number;

  @ApiPropertyOptional()
  estado: string;

  @ApiPropertyOptional()
  activo: boolean;

  constructor(noti: NotificacionEntity) {
    super(noti);
    this.mensaje = noti.mensaje;
    this.numero = noti.numero;
    this.intentos = noti.intentos;
    this.estado = noti.estado;
    this.activo = noti.activo;
  }
}
