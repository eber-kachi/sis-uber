import { DataSource, Repository } from 'typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { Injectable } from '@nestjs/common';
// export class ClienteRepository extends Repository<ClienteEntity> {}

@Injectable()
export class ClienteRepository extends Repository<ClienteEntity> {
  constructor(private dataSource: DataSource) {
    super(ClienteEntity, dataSource.createEntityManager());
  }
}
