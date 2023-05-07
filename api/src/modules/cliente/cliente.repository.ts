import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ClienteEntity } from './entities/cliente.entity';
@EntityRepository(ClienteEntity)
export class ClienteRepository extends Repository<ClienteEntity> {}
