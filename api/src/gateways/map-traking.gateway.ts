import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EstadoViaje } from 'common/constants/estado-viaje';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: { origin: '*' },
})
export class MapTrakingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private pendienteConfirmacion: Array<any> = [];

  constructor() {
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
}
