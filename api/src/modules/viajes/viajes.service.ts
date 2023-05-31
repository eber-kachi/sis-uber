import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { UserService } from '../user/user.service';
import { ViajeRepository } from './viajes.repository';
import { CreateViajeClient } from './dto/create-viaje-client';
import { RoleType } from 'common/constants/role-type';
import { SocioService } from '../socio/socio.service';
import { EstadoViaje } from '../../common/constants/estado-viaje';

@Injectable()
export class ViajesService {
  constructor(
    public readonly viajeRepository: ViajeRepository,
    public readonly userService: UserService,
    public readonly socioService: SocioService,
  ) {}

  async create(createViajeDto: CreateViajeClient) {
    console.log('CreateViajeClient', createViajeDto);
    const user = await this.userService.getByEmail(createViajeDto.user_email);
    // verificamos que el usuario es de rol cliente
    if (user && user.role != RoleType.CLIENT) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Cliente No encotrado.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const viaje = this.viajeRepository.create(createViajeDto);
    viaje.cliente = user.cliente;
    return this.viajeRepository.save(viaje);
  }

  async findAll() {
    const datas = await this.viajeRepository.find({ order: { createdAt: 'DESC' } });
    return datas;
  }

  findOne(id: number) {
    return `This action returns a #${id} viaje`;
  }

  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

  async findAllByClientId(id: string) {
    // const viajes= await this.viajeRepository.find({where: {socio:id}});

    return await this.viajeRepository.find({ where: { cliente: id } });
  }

  async asignationSocioWithClient(createViajeDto: any) {
    if (!createViajeDto.socio_id && !createViajeDto.viaje_id) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'socio_id no existe o viaje_id no existe.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const socio = await this.socioService.findOne(createViajeDto.socio_id);
    if (!socio) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Socio no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const viaje = await this.viajeRepository.findOne(createViajeDto.viaje_id);
    viaje.estado = EstadoViaje.PENDIENTECONFIRMACIONSOCIO;
    viaje.socio = socio;
    return await this.viajeRepository.save(viaje);
  }

  async confirmarViajeSocioByViajeId(createViajeDto: any) {
    const viaje = await this.viajeRepository.findOne(createViajeDto.viaje_id);
    viaje.estado = EstadoViaje.CONFIRMADO;
    return await this.viajeRepository.save(viaje);
  }
  // return this.viajeRepository.update('', viaje);
}
