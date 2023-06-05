import { Injectable } from '@nestjs/common';
import { ClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteRepository } from './cliente.repository';
//import { UserRepository } from '../user/user.repository';
import { UserService } from 'modules/user/user.service';
import { ClienteRegisterDto } from './dto/cliente-register.dto';
import { RoleType } from 'common/constants/role-type';
// generate report to pdf
import * as path from 'path';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import { log } from 'console';

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
    return await this.clienteRepository.findOneBy({ id: id });
    // {
    // where: findData,
    // relations: ['medico'],
    // });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const clienteUpdate = await this.clienteRepository.findOneBy({ id });
    if (!clienteUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.clienteRepository.update(id, updateClienteDto);
    return await this.clienteRepository.findOneBy({ id });
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

  async reportviajes() {
    // get datetime of Date
    const date = new Date();
    // yeas month day min
    // const datetime =
    //   date.getFullYear() +
    //   '-' +
    //   (date.getMonth() + 1) +
    //   '-' +
    //   date.getDate() +
    //   ' ' +
    //   date.getHours() +
    //   ':' +
    //   date.getMinutes();
    // const datetime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()+ ;
    const clientes = await this.clienteRepository.find({
      relations: ['user', 'viajes'],
    });

    const viajes = clientes.map((cliente, index) => ({
      cliente: `${cliente.nombres} ${cliente.apellidos}`,
      totalViajes: cliente.viajes.length,
      id: index + 1,
    }));

    const data = {
      title: 'Lista de clientes con total viajes ',
      // datetime: datetime,
      table: {
        headers: ['#', 'Cliente', 'Viajes'],
        rows: viajes,
      },
    };
    const filePath = path.join(process.cwd(), 'report-template', 'pdf-cliente-viajes.hbs');
    return createPdf(
      filePath,
      {
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
          left: '10mm',
          top: '25mm',
          right: '10mm',
          bottom: '15mm',
        },
        // headerTemplate: `<div style="width: 100%; text-align: center;"><span style="font-size: 20px;">Sindicato </span><br><span class="date" style="font-size:15px"><span></div>`,
        headerTemplate: `<div style="width: 100%; text-align: center;"><span class="date" style="font-size:10px"><span></div>`,
        footerTemplate:
          '<div style="width: 100%; text-align: center; font-size: 10px;"> <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
        landscape: true,
      },
      data,
    );
    // return '';
  }
}
