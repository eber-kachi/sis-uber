import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EstadoViaje, StateHandlerEvents } from 'common/constants/estado-viaje';
import { Server, Socket } from 'socket.io';
import { SocioService } from '../modules/socio/socio.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MapTrakingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  loger = new Logger();
  private pendienteConfirmacion: Array<any> = [];
  private asignacions = new Object();
  // private asignacionSocio = new Object();
  private static asignacionSocio: Map<string, any> = new Map();
  clients: any[] = [];
  constructor(
    private readonly sociosService: SocioService, // private readonly sociosService: SocioService,
  ) {} // private readonly  ticketSrvice: TicketService,

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Esto se ejecuta cuando inicia');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.clients.push(client.id);
    console.log('Hola alguien se conecto al socket 👌👌👌 => ', client.id);
  }

  handleDisconnect(client: Socket) {
    // this.clients= this.clients.reduce((array,c)=>  ,[]);
    this.clients.splice(this.clients.indexOf(client.id), 1);
    console.log('ALguien se fue! chao chao' + client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    //  this.server.emit('message', payload);
    this.server.emit('message', payload);
    // client.join(`room_${payload}`);
  }

  // pendiente_confirmacion
  @SubscribeMessage(EstadoViaje.PENDIENTECONFIRMACION)
  handlePendienteConfirmation(client: any, payload: any) {
    // this.pendienteConfirmacion.push(payload);
    this.server.emit(EstadoViaje.PENDIENTECONFIRMACION, payload);
  }

  @SubscribeMessage(StateHandlerEvents.SOCIOACTIVOEVENTO)
  handleSocioactivo(client: any, payload: any) {
    this.server.emit(StateHandlerEvents.SOCIOACTIVOEVENTO, payload);
  }

  @SubscribeMessage(StateHandlerEvents.SOCIOINACTIVOEVENTO)
  handleSocioinactivo(client: any, payload: any) {
    this.server.emit(StateHandlerEvents.SOCIOINACTIVOEVENTO, payload);
  }

  @SubscribeMessage('asignacion_event_socio')
  handleasignacion_event_socio(client: Socket, payload: { socio_id: string; data: any }) {
    // buscamos si el soco tiene asignaciones en asignacionSocio
    console.log('handleasignacion_event_socio: viaje_id=> ', payload.data.id);
    try {
      if (
        MapTrakingGateway.asignacionSocio.has(payload.data.id) &&
        payload.data.estado === 'CONFIRMADO'
      ) {
        // cuando el socio acepta el viaje notificamos al cliente que su viaje fua aceptado y que va un veiculo a recogerle
        if (payload.data.estado === 'CONFIRMADO') {
          this.server.emit('socio-events-change', payload);
        }
        // notificar al cliente que termino el viaje
        // this.server.emit('asignacion_event_socio', payload);
      } else {
        if (MapTrakingGateway.asignacionSocio.has(payload.data.id)) {
          MapTrakingGateway.asignacionSocio.delete(payload.data.id);
          this.handlePendienteConfirmation(null, payload.data);
        }
        const rooms = this.server.sockets.adapter.rooms;

        const clients = rooms['my-room'];

        console.log('The list of clients connected to the room my-room:');
        // clients.forEach((client) => {
        //   console.log(client);
        // });

        MapTrakingGateway.asignacionSocio.set(payload.data.id, payload.data);

        // this.server.emit('asignacion_event_socio' + payload.socio_id, payload);
        // this.handler_socio_conect(null, null);
        // this.server.
        this.server.to(`socio_events_${payload.socio_id}`).emit('socio_events_change', payload);
      }
    } catch (error) {
      client.emit(EstadoViaje.PENDIENTECONFIRMACION, payload.data);
    }
  }

  @SubscribeMessage('asignacion_event')
  handler_asignacion_event(client: any, payload: { id: string; data: any }) {
    // buscamos si el soco tiene asignaciones en asignacionSocio
    if (MapTrakingGateway.asignacionSocio.has(payload.id)) {
    } else {
      MapTrakingGateway.asignacionSocio.set(payload.id, payload.data);
    }
  }

  @SubscribeMessage('finalizar_viaje_event') //id => viaje_id
  handler_finalizar_viaje(client: any, payload: { id: string; data: any }) {
    // buscamos si el soco tiene asignaciones en asignacionSocio
    if (MapTrakingGateway.asignacionSocio.has(payload.id)) {
      this.server.emit('finalizar_viaje_event', payload);
      MapTrakingGateway.asignacionSocio.delete(payload.id);
    } else {
      // mandar un error  de que no hay la asignacion
      throw new Error('Paso un erro no hay viaje');
    }
  }
  @SubscribeMessage('socios_conectados')
  async handler_socio_conect(client: Socket, payload: { socio_id: string; location: any }) {
    if (payload !== undefined) {
      // const socio = await this.sociosService.findOne(payload.socio_id);
      // if (socio.estado == 'LIBRE') {
      //   await this.sociosService.changeState(payload.socio_id, 'OCUPADO', payload.location);
      // }
      // if (socio.estado == 'OCUPADO') {
      //   await this.sociosService.changeState(payload.socio_id, 'LIBRE', payload.location);
      // }
    }

    const socios = await this.sociosService.getAllWithStatus();
    // client.emit('socios_conectados', socios);
    this.server.emit('socios_conectados', socios);
  }
  /**
   * se encarga de unir
   * @param client
   * @param specialty
   */
  //crendo un room para que se unan los oscios activos
  @SubscribeMessage('socio_join')
  handleJoinSpecialty(client: Socket, socio_id: string) {
    this.loger.log('Socio joid to events => ' + socio_id, '@SubscribeMessage(socio_join)');
    client.join(`socio_events_${socio_id}`);
  }

  @SubscribeMessage('socio_leave')
  handleRoomLeave(client: Socket, socio_id: string) {
    this.loger.log('Chao to events =>' + socio_id, '  @SubscribeMessage(socio_leave)');

    client.leave(`socio_events_${socio_id}`);
  }

  // socket para comunicar a los socios y clientes de un viaje
  @SubscribeMessage('viaje_change_event')
  handleviaje_change_event(client: any, payload: { viaje_id: string; data: any }) {
    this.server
      .to('viaje_run_' + payload.viaje_id)
      .emit('viaje_change_event' + payload.viaje_id, payload);
  }

  @SubscribeMessage('viaje_join')
  handleJoinViaje(
    client: Socket,
    payload: { viaje_id: string; socio_id?: string; cliente_id?: string },
  ) {
    this.loger.log('Join viajes => ' + payload, ' @SubscribeMessage(viaje_join)');
    client.join(`viaje_run_${payload.viaje_id}}`);
  }

  @SubscribeMessage('viaje_leave')
  handleViajeLeave(
    client: Socket,
    payload: { viaje_id: string; socio_id?: string; cliente_id?: string },
  ) {
    this.loger.log('Chao to events =>' + payload, '  @SubscribeMessage(viaje_leave)');

    client.leave(`viaje_run_${payload.viaje_id}}`);
  }
  // fin de la comunicacion
}
