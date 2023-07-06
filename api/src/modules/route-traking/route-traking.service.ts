import { Injectable } from '@nestjs/common';
import { CreateRouteTrakingDto } from './dto/create-route-traking.dto';
import { UpdateRouteTrakingDto } from './dto/update-route-traking.dto';

@Injectable()
export class RouteTrakingService {
  create(createRouteTrakingDto: CreateRouteTrakingDto) {
    return 'This action adds a new routeTraking';
  }

  findAll() {
    return `This action returns all routeTraking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} routeTraking`;
  }

  update(id: number, updateRouteTrakingDto: UpdateRouteTrakingDto) {
    return `This action updates a #${id} routeTraking`;
  }

  remove(id: number) {
    return `This action removes a #${id} routeTraking`;
  }
}
