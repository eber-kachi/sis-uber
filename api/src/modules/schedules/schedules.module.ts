import { forwardRef, Module } from '@nestjs/common';
import { MedicTaskService } from './medic-task/medic-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MedicTaskController } from './medic-task/medic-task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicTaskRepository } from './medic-task/medic-task.repository';
import { NotificacionService } from './notificacion/notificacion.service';
import { NotificacionRepository } from './notificacion/notificacion.repository';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicTaskRepository, NotificacionRepository]),
    ScheduleModule.forRoot(),
    forwardRef(() => NotificationModule),
  ],
  controllers: [MedicTaskController],
  providers: [MedicTaskService, NotificacionService],
  exports: [MedicTaskService, NotificacionService],

})
export class SchedulesModule {
}
