import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificacionRepository } from './notificacion.repository';
import { WhatsappService } from '../../notification/whatsapp/whatsapp.service';

// import { pipe } from 'rxjs';


@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);

  constructor(
    public readonly notificacionRepository: NotificacionRepository,
    public readonly whatsappService: WhatsappService,
  ) {

  }

  @Cron(CronExpression.EVERY_10_MINUTES) // tODO EL TIEMPO CADA 10 MIN”
  // @Cron(CronExpression.EVERY_5_SECONDS) // A las 00 : 00 los lunes. ”
  // @Cron('3 * * * *') //
  async checkNotifications() {
    await this.mandarNotificacion();

    this.logger.debug('Verificando nuevas notificaciones cada 10 min');
  }

  async mandarNotificacion() {
    const pendientes = await this.getNotificacionesPendientes();
    // console.log(pendientes);

    // const p$ = of(...pendientes);
    // p$.pipe(
    // tap(value => {
    //   console.log('pendientes: ',value)
    // }),
    // debounceTime(500),
    // switchMap((pe) => {
    //   console.log('aqui', pe);
    // return of(pe);
    // return this.whatsappService.sendMessage(pe.mensaje, pe.numero)
    //   .pipe(
    //     tap(value => {
    //       console.log('mensaje envido', value);
    //     }),
    //     catchError(err => {
    //       console.log('mostrando error ', err.response.data.status);
    //       return of(err);
    //     }),
    //   );
    // }),
    // catchError(err => {
    //   return of([]);
    // }),
    // ).subscribe();

    for (let p of pendientes) {
      this.whatsappService.sendMessage(p.mensaje, p.numero)
        .pipe()
        .subscribe(
          async (res) => {

            const a = await this.notificacionRepository.findOne(p.id);
            a.intentos = a.intentos + 1;
            a.estado = 'ENVIADO';
            await this.notificacionRepository.save(a);
            console.log('guardar como enviado');
          },
          async (error) => {
            const a = await this.notificacionRepository.findOne(p.id);
            a.intentos = a.intentos + 1;
            await this.notificacionRepository.save(a);
            this.logger.error('mensaje no enviado..');
          });

      setTimeout(() => {
      }, 1000);
      console.log('paso', p.id);
    }
  }

  async getNotificacionesPendientes() {
    return await this.notificacionRepository.find({
      where: { estado: 'PENDIENTE' },
      order: { updatedAt: 'DESC' },
    });
  }

  async crear(param: { mensaje: any, estado: string | 'PENDIENTE', numero: string }) {
    const noti = await this.notificacionRepository.create(param);
    return await this.notificacionRepository.save(noti);
  }
}
