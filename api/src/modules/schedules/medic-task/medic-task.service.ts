import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MedicTaskRepository } from './medic-task.repository';

@Injectable()
export class MedicTaskService {
  private readonly logger = new Logger(MedicTaskService.name);

  constructor(
    public readonly medicTaskRepository: MedicTaskRepository,
  ) {

  }

  @Cron('0 0 * * 1') // A las 00 : 00 los lunes. ”
  updateDBMedic() {

    console.log('hacer la coneccion a la db ');
    console.log('recuperar datos de los medicos');
    console.log('actualizar DB mysql medicos');
    console.log('persistir la actualizacion');
    this.updateState().then(res => {
      console.log(res);
    });
    this.logger.debug('Called when the current second is 45');
  }


  async updateState() {
    const medi = await this.medicTaskRepository.create({ fecha: new Date() });
    return this.medicTaskRepository.save(medi);
  }


  async getLastData() {
    const medics = await this.medicTaskRepository.find({
      order: {
        fecha: 'ASC',
      },
    });
    return medics.at(medics.length - 1);
  }
}
