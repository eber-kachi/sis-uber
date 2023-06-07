import { Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { RoleType } from 'common/constants/role-type';

@Injectable()
export class RolService {
  create(createRolDto: CreateRolDto) {
    throw new Error('No implent');
  }

  findAll() {
    const directions = Object.values(RoleType);
    return directions;
  }

  findOne(id: number) {
    return `This action returns a #${id} rol`;
  }

  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} rol`;
  }

  remove(id: number) {
    return `This action removes a #${id} rol`;
  }
}
