import { Injectable } from '@nestjs/common';
import { ClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteRepository } from './cliente.repository';
//import { UserRepository } from '../user/user.repository';
import { UserService } from 'modules/user/user.service';
import { ClienteRegisterDto } from './dto/cliente-register.dto';
import { RoleType } from 'common/constants/role-type';

@Injectable()
export class ClienteService {
  constructor(
    public readonly clienteRepository: ClienteRepository,
    // public readonly userRepository: UserRepository,
    public readonly userService: UserService,
  ) {}

  async create(createClienteDto: ClienteRegisterDto) {
    //buscar si usuario ya existe
    const user = await this.userService.createWithRole(
      {
        // email: `${createClienteDto.nombres}@gmail.com`,
        email: createClienteDto.email,
        password: createClienteDto.password,
      },
      RoleType.CLIENT,
    );

    const cliente = await this.clienteRepository.create(createClienteDto);
    cliente.nombres = createClienteDto.nombres;
    cliente.apellidos = createClienteDto.nombres;
    cliente.user = user;
    cliente.viajes = null;
    cliente.direccionMadre = null;

    return this.clienteRepository.save(cliente);
  }

  async findAll() {
    const cliente = await this.clienteRepository.find({ order: { createdAt: 'DESC' } });
    return cliente;
  }

  async findOne(id: string) {
    return await this.clienteRepository.findOneOrFail(id);
    // {
    // where: findData,
    // relations: ['medico'],
    // });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const clienteUpdate = await this.clienteRepository.findOne(id);
    if (!clienteUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.clienteRepository.update(id, updateClienteDto);
    return await this.clienteRepository.findOne(id);
  }

  async remove(id: string) {
    const clientes = await this.clienteRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
    if (clientes != undefined) {
      this.userService.remove(clientes.user?.id).then();
    }
    return await this.clienteRepository.remove(clientes);
  }
}
