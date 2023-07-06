import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { UserService } from '../user/user.service';
import { ViajeRepository } from './viajes.repository';
import { CreateViajeClient } from './dto/create-viaje-client';
import { RoleType } from 'common/constants/role-type';
import { SocioService } from '../socio/socio.service';
import { EstadoViaje } from '../../common/constants/estado-viaje';
import { format } from 'date-fns';
import { log } from 'console';

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
    const res = await this.viajeRepository.save(viaje);

    return await this.viajeRepository.findOne({
      where: { id: res.id },
      relations: ['cliente', 'socio'],
    });
  }

  async findAll() {
    const datas = await this.viajeRepository.find({ order: { createdAt: 'DESC' } });
    return datas;
  }

  async findOne(id: string) {
    return await this.viajeRepository.findOneBy({ id });
  }

  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

  async findAllByClientId(id: string) {
    // const viajes= await this.viajeRepository.find({where: {socio:id}});

    return await this.viajeRepository.find({ where: { cliente: { id: id } } });
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

    const viaje = await this.viajeRepository.findOne({
      where: { id: createViajeDto.viaje_id },
      relations: ['cliente', 'socio'],
    });
    if (!viaje) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Viaje no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    viaje.estado = EstadoViaje.PENDIENTECONFIRMACIONSOCIO;
    viaje.socio = socio;
    return await this.viajeRepository.save(viaje);
  }

  async confirmarViajeSocioByViajeId(createViajeDto: any) {
    const viaje = await this.viajeRepository.findOne(createViajeDto.viaje_id);
    viaje.estado = EstadoViaje.CONFIRMADO;
    return await this.viajeRepository.save(viaje);
  }

  async getLastTrip(socio_id = null, cliente_id = null) {
    if (socio_id != null) {
      const viajes = await this.viajeRepository.find({
        order: { createdAt: 'DESC' },
        where: { socio: { id: socio_id } },
        relations: ['cliente'],
        take: 5,
      });
      return viajes;
    }

    const viajes = await this.viajeRepository.find({
      order: { createdAt: 'DESC' },
      where: { cliente: cliente_id },
      relations: ['socio'],
      take: 5,
    });
    return viajes;
  }

  async changeStatusViajeById(createViajeDto) {
    console.log('changeStatusViajeById: viaje_id=> ', createViajeDto.viaje_id);

    const viaje = await this.viajeRepository.findOne({
      where: { id: createViajeDto.viaje_id },
      relations: ['cliente'],
    });
    viaje.estado = createViajeDto.estado;
    const currentDateTime = new Date();
    // 2023-06-29 09:08:48
    if (createViajeDto.status === EstadoViaje.INICIANDOVIAJE) {
      viaje.start_time = createViajeDto.start_time;
      viaje.fecha = format(currentDateTime, 'yyy-MM-dd HH:mm:ss');
    }

    if (createViajeDto.status === EstadoViaje.FINALIZADO) {
      viaje.estado = createViajeDto.estado;
      //location
      viaje.end_latitude = createViajeDto.latitude;
      viaje.end_longitude = createViajeDto.longitude;
      viaje.distancia_recorrida = createViajeDto?.distancia_recorrida || 0;
      viaje.end_time = format(currentDateTime, 'yyy-MM-dd HH:mm:ss');
    }

    return await this.viajeRepository.save(viaje);
  }

  async setRating(create: { viaje_id: string; calificacion: string | number }) {
    const viaje = await this.viajeRepository.findOne({
      where: { id: create.viaje_id },
      relations: ['cliente'],
    });
    viaje.calificacion = Number(create.calificacion);
    return await this.viajeRepository.save(viaje);
  }
}
