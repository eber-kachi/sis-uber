import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGrupotrabajoDto } from './dto/create-grupotrabajo.dto';
import { UpdateGrupotrabajoDto } from './dto/update-grupotrabajo.dto';
import { GrupotrabajoRepository } from './grupotrabajo.repository';

@Injectable()
export class GrupotrabajoService {
  /**
   *
   */
  constructor(public readonly grupotrabajoRepository: GrupotrabajoRepository) { }
  async create(createGrupotrabajoDto: CreateGrupotrabajoDto) {
    const grupo = this.grupotrabajoRepository.create(createGrupotrabajoDto);
    return await this.grupotrabajoRepository.save(grupo);
  }

  async findAll() {
    const grupos = await this.grupotrabajoRepository.find({ order: { createdAt: 'DESC' } });
    return grupos;
  }

  async findOne(id: string) {
    const grupos = await this.grupotrabajoRepository.findOne({ where: { id: id } });
    return grupos;
  }

  async update(id: string, updateGrupotrabajoDto: UpdateGrupotrabajoDto) {
    const socioUpdate = await this.grupotrabajoRepository.findOneBy({ id });
    if (!socioUpdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.grupotrabajoRepository.update(id, updateGrupotrabajoDto);
    return await this.grupotrabajoRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const grupo = await this.grupotrabajoRepository.findOne({
      where: { id: id },
      relations: ['socios'],
    });
    if (grupo.socios.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'No es posible borrar grupo, tiene socios asociados ' + grupo.socios.length,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.grupotrabajoRepository.remove(grupo);
  }
}
