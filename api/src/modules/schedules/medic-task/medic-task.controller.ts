import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { MedicTaskService } from './medic-task.service';

@Controller('medico-task')
export class MedicTaskController {
  constructor(
    private readonly medicTaskService: MedicTaskService,
  ) {
  }

  @Get('/force')
  // @Auth(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  updateDBMedic(@Res() response) {

    this.medicTaskService.updateDBMedic();

    return response
      .status(HttpStatus.CREATED)
      .json({ ok: true, message: 'Actualizando...' });
  }

  @Get('/last')
// @Auth(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getLastData(@Res() response) {
    const last = await this.medicTaskService.getLastData();

    return response
      .status(HttpStatus.ACCEPTED)
      .json(last);
  }


}
