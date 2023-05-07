import { Injectable } from '@nestjs/common';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioRepository } from './socio.repository';

@Injectable()
export class SocioService {
  constructor(public readonly socioRepository: SocioRepository) {}

  async create(createSocioDto: SocioDto) {
    const socio = this.socioRepository.create(createSocioDto);
    return this.socioRepository.save(socio);
  }

  async findAll() {
    const socios = await this.socioRepository.find();

    return socios;
  }

  findOne(id: number) {
    return this.socioRepository.findOne({
      // where: findData,
      // relations: ['medico'],
    });
  }

  async update(id: number, updateSocioDto: UpdateSocioDto) {
    const socioUpdate = await this.socioRepository.findOne(id);
    if (!socioUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.socioRepository.update(id, updateSocioDto);
    return await this.socioRepository.findOne(id);
  }

  async remove(id: number) {
    const socios = await this.socioRepository.find({ where: { id: id } });
    return await this.socioRepository.remove(socios);
  }
}
