import { Injectable } from '@nestjs/common';
import { VeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { VeiculoRepository } from './veiculo.repository';

@Injectable()
export class VeiculoService {
  constructor(public readonly veiculoRepository: VeiculoRepository) {}

  async create(createVeiculoDto: VeiculoDto) {
    const socio = this.veiculoRepository.create(createVeiculoDto);
    return this.veiculoRepository.save(socio);
  }

  async findAll() {
    const socios = await this.veiculoRepository.find();
    return socios;
  }

  findOne(id: number) {
    return `This action returns a #${id} veiculo`;
  }

  async update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
    const socioUpdate = await this.veiculoRepository.findOne(id);
    if (!socioUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.veiculoRepository.update(id, updateVeiculoDto);
    return await this.veiculoRepository.findOne(id);
  }

  async remove(id: string) {
    const socios = await this.veiculoRepository.find({ where: { id: id } });
    return await this.veiculoRepository.remove(socios);
  }
}
