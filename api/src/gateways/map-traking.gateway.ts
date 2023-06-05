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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MapTrakingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private pendienteConfirmacion: Array<any> = [];
  private asignacions = new Object();
  // private asignacionSocio = new Object();
  private static asignacionSocio: Map<string, any> = new Map();

  constructor(private readonly sociosService: SocioService) {} // private readonly  ticketSrvice: TicketService,

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Esto se ejecuta cuando inicia');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Hola alguien se conecto al socket 👌👌👌 => ', client.id);
  }

  handleDisconnect(client: any) {
    console.log('ALguien se fue! chao chao');
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
  handleasignacion_event_socio(client: any, payload: { socio_id: string; data: any }) {
    // buscamos si el soco tiene asignaciones en asignacionSocio
    if (MapTrakingGateway.asignacionSocio.has(payload.socio_id)) {
      // cuando el socio acepta el viaje notificamos al cliente que su viaje fua aceptado y que va un veiculo a recogerle
      if (payload.data.estado === 'confirmado') {
        this.server.emit('viaje_aceptado', payload.data);
      }
      // notificar al cliente que termino el viaje
      // this.server.emit('asignacion_event_socio', payload);
    } else {
      MapTrakingGateway.asignacionSocio.set(payload.socio_id, payload.data);
      this.server.emit('asignacion_event_socio' + payload.socio_id, payload);
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
}
