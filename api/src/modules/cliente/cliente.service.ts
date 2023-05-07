import { Injectable } from '@nestjs/common';
import { ClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteRepository } from './cliente.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ClienteService {
  constructor(
    public readonly socioRepository: ClienteRepository,
    // public readonly userRepository: UserRepository,
  ) {}

  create(createClienteDto: ClienteDto) {
    const cliente = this.socioRepository.create(createClienteDto);

    return 'This action adds a new cliente';
  }

  findAll() {
    return `This action returns all cliente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
