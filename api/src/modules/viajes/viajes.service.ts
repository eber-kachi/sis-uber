import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { UserService } from '../user/user.service';
import { ViajeRepository } from './viajes.repository';
import { CreateViajeClient } from './dto/create-viaje-client';
import { RoleType } from 'common/constants/role-type';

@Injectable()
export class ViajesService {
  constructor(
    public readonly viajeRepository: ViajeRepository,
    public readonly userService: UserService,
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
}
