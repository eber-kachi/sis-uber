import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { NotificacionDto } from './notificacionDto';


@Entity({ name: 'notificaciones' })
export class NotificacionEntity extends AbstractEntity<NotificacionDto> {
  @Column({ nullable: true, type: 'text' })
  mensaje: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true, type: 'int', default: 0 })
  intentos: number;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true, type: 'boolean' })
  activo: boolean;

  dtoClass = NotificacionDto;

}
