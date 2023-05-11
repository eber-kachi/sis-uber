import { Injectable } from '@nestjs/common';
import { ViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { SocioRepository } from '../socio/socio.repository';
import { UserService } from '../user/user.service';
import { ViajeRepository } from './viajes.repository';

@Injectable()
export class ViajesService {
  constructor(
    public readonly viajeRepository: ViajeRepository,
  ) {}

  create(createViajeDto: any) {
    return 'This action adds a new viaje';
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

    return await this.viajeRepository.find({where: {cliente:id}});
  }
}
