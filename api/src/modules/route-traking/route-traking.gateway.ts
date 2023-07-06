import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { RouteTrakingService } from './route-traking.service';
import { CreateRouteTrakingDto } from './dto/create-route-traking.dto';
import { UpdateRouteTrakingDto } from './dto/update-route-traking.dto';

@WebSocketGateway()
export class RouteTrakingGateway {
  constructor(private readonly routeTrakingService: RouteTrakingService) {}

  @SubscribeMessage('createRouteTraking')
  create(@MessageBody() createRouteTrakingDto: CreateRouteTrakingDto) {
    return this.routeTrakingService.create(createRouteTrakingDto);
  }

  @SubscribeMessage('findAllRouteTraking')
  findAll() {
    return this.routeTrakingService.findAll();
  }

  @SubscribeMessage('findOneRouteTraking')
  findOne(@MessageBody() id: number) {
    return this.routeTrakingService.findOne(id);
  }

  @SubscribeMessage('updateRouteTraking')
  update(@MessageBody() updateRouteTrakingDto: UpdateRouteTrakingDto) {
    return this.routeTrakingService.update(updateRouteTrakingDto.id, updateRouteTrakingDto);
  }

  @SubscribeMessage('removeRouteTraking')
  remove(@MessageBody() id: number) {
    return this.routeTrakingService.remove(id);
  }
}
