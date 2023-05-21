import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: { origin: '*' },
})
export class MapTrakingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor() {} // private readonly  ticketSrvice: TicketService,

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Esto se ejecuta cuando inicia');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Hola alguien se conecto al socket 👌👌👌');
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
}
