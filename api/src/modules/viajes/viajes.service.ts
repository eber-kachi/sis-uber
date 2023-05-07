import { Injectable } from '@nestjs/common';
import { ViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';

@Injectable()
export class ViajesService {
  create(createViajeDto: any) {
    return 'This action adds a new viaje';
  }

  findAll() {
    return `This action returns all viajes`;
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
}
