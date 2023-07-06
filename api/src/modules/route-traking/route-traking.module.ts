import { Module } from '@nestjs/common';
import { RouteTrakingService } from './route-traking.service';
import { RouteTrakingGateway } from './route-traking.gateway';

@Module({
  providers: [RouteTrakingGateway, RouteTrakingService]
})
export class RouteTrakingModule {}
