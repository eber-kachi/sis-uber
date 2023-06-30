import { Injectable } from '@nestjs/common';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioRepository } from './socio.repository';
// import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { RoleType } from 'common/constants/role-type';
import { In } from 'typeorm';
import { GrupotrabajoService } from 'modules/grupotrabajo/grupotrabajo.service';

@Injectable()
export class SocioService {
  constructor(
    public readonly socioRepository: SocioRepository,
    // public readonly userRepository: UserRepository,
    public readonly userService: UserService,
    public readonly grupoTrabajo: GrupotrabajoService,
  ) {}

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

    return this.socioRepository.save(socio);
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
      relations: ['user', 'grupotrabajo'],
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
}
