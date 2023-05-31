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

  constructor(
    private readonly sociosService: SocioService,
  ) {
    console.log();
  } // private readonly  ticketSrvice: TicketService,

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
    this.pendienteConfirmacion.push(payload);
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

}
