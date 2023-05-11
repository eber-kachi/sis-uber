import { Injectable } from '@nestjs/common';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioRepository } from './socio.repository';
// import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class SocioService {
  constructor(
    public readonly socioRepository: SocioRepository,
    // public readonly userRepository: UserRepository,
    public readonly userService: UserService,
  ) {
  }

  async create(createSocioDto: SocioDto) {
    console.log('createSocioDto =>', createSocioDto);
    const user = await this.userService.createUser({
      email: `${createSocioDto.nombres}@gmail.com`,
      password: createSocioDto.ci,
    }, null);
    const socio = await this.socioRepository.create(createSocioDto);
    socio.user = user;

    return this.socioRepository.save(socio);
  }

  async findAll() {
    const socios = await this.socioRepository.find({ order: { createdAt: 'DESC' } });
    return socios;
  }

  async findOne(id: string) {
    return await this.socioRepository.findOneOrFail(id);
    // {
      // where: findData,
      // relations: ['medico'],
    // });
  }

  async update(id: string, updateSocioDto: UpdateSocioDto) {
    const socioUpdate = await this.socioRepository.findOne(id);
    if (!socioUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error('Todo doesn\'t exist');
    }
    await this.socioRepository.update(id, updateSocioDto);
    return await this.socioRepository.findOne(id);
  }

  async remove(id: string) {
    const socios = await this.socioRepository.findOneOrFail({ where: { id }, relations: ['user'] });
      this.userService.remove(socios?.user?.id).then();
    return await this.socioRepository.remove(socios);
  }
}
