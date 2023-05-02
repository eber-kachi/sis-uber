import { EntityRepository, Repository } from 'typeorm';
import { NotificacionEntity } from './notificacion.entity';


@EntityRepository(NotificacionEntity)
export class NotificacionRepository extends Repository<NotificacionEntity> {
}
