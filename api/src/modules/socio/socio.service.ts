import { Injectable } from '@nestjs/common';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioRepository } from './socio.repository';
// import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { RoleType } from 'common/constants/role-type';
import { In } from 'typeorm';
import { GrupotrabajoService } from 'modules/grupotrabajo/grupotrabajo.service';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import path from 'path';
import { log } from 'console';

@Injectable()
export class SocioService {
  constructor(
    public readonly socioRepository: SocioRepository,
    // public readonly userRepository: UserRepository,
    public readonly userService: UserService,
    public readonly grupoTrabajo: GrupotrabajoService,
  ) { }

  async create(createSocioDto: SocioDto) {
    const user = await this.userService.createWithRole(
      {
        email: createSocioDto.email,
        password: createSocioDto.ci,
      },
      RoleType.DRIVER,
    );
    const socio = await this.socioRepository.create(createSocioDto);
    socio.user = user;
    socio.grupotrabajo_id = createSocioDto.grupotrabajo_id;

    return await this.socioRepository.save(socio);
  }

  async addcardBysocioid(createSocioDto: any) {
    const socioUpdate = await this.socioRepository.findOne({
      where: { id: createSocioDto.socio_id },
    });
    return await this.socioRepository.update(socioUpdate.id, {
      veiculo: { id: createSocioDto.veiculo_id },
    });
  }

  async findAll() {
    const socios = await this.socioRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['veiculo', 'grupotrabajo'],
    });
    return socios;
  }

  async findOne(id: string) {
    return await this.socioRepository.findOneOrFail({
      where: { id: id },
      relations: ['user', 'grupotrabajo', 'veiculo'],
    });
    // {
    // where: findData,
    // relations: ['medico'],
    // });
  }
  async findByEmail(email: string) {
    const socio = await this.userService.getByEmail(email);
    return socio;
  }

  async update(id: string, updateSocioDto: UpdateSocioDto) {
    console.log({ updateSocioDto });
    const socioUpdate = await this.socioRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!socioUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    // actualizamos el usuario primero el email
    await this.userService.update(socioUpdate.user.id, { email: updateSocioDto.email });
    // quitamos un valor del objeto
    delete updateSocioDto.email;
    // delete updateSocioDto?.user_id;
    if (updateSocioDto.grupotrabajo_id) {
      const grupo = await this.grupoTrabajo.findOne(updateSocioDto.grupotrabajo_id);
      socioUpdate.grupotrabajo = grupo;
    }
    await this.socioRepository.update(id, { ...updateSocioDto });
    return await this.socioRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const socios = await this.socioRepository.findOneOrFail({ where: { id }, relations: ['user'] });
    if (socios != undefined) {
      this.userService.remove(socios.user?.id).then();
    }
    return await this.socioRepository.remove(socios);
  }

  async findAllByState(state: string) {
    // todo validar que tambien esten activos los socios
    const socios = await this.socioRepository.find({
      where: { estado: state },
      order: { createdAt: 'DESC' },
      relations: ['veiculo'],
    });
    return socios;
  }
  async getAllWithStatus() {
    // todo validar que tambien esten activos los socios
    const socios = await this.socioRepository.find({
      where: {
        estado: In(['LIBRE', 'OCUPADO']),
      },
      order: { createdAt: 'DESC' },
      relations: ['veiculo'],
    });
    return socios;
  }
  // crear un metodo para activar o intivar un socio
  async enabled(id: string) {
    const socio = await this.socioRepository.findOneBy({ id });

    socio.activo = !socio.activo;

    return this.socioRepository.save(socio);
  }

  async changeState(socio_id: string, state: string, location?: any) {
    const socio = await this.socioRepository.findOneBy({ id: socio_id });
    if (location) {
      socio.latitude = parseFloat(location.latitude);
      socio.longitude = parseFloat(location.longitude);
    }

    socio.estado = state;

    return this.socioRepository.save(socio);
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
    const socios = await this.socioRepository.find({
      relations: ['user', 'viajes', 'veiculo', 'grupotrabajo'],
      order: { nombres: 'ASC', apellidos: 'ASC', viajes: { fecha: 'DESC' } },
    });

    // const viajes = clientes.map((cliente, index) => ({
    //   cliente: `${cliente.nombres} ${cliente.apellidos}`,
    //   totalViajes: cliente.viajes.length,
    //   id: index + 1,
    // }));

    const data = {
      title: 'Lista de socios',
      // datetime: datetime,
      i: 1,
      socios: socios,
      table: {
        headers: ['#', 'Fecha', 'Estado', 'Calificacion', 'Direccion', 'Tiempos'],
      },
    };
    const filePath = path.join(process.cwd(), 'report-template', 'pdf-socios-viajes.hbs');
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
