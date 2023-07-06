import { Test, TestingModule } from '@nestjs/testing';
import { RouteTrakingGateway } from './route-traking.gateway';
import { RouteTrakingService } from './route-traking.service';

describe('RouteTrakingGateway', () => {
  let gateway: RouteTrakingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteTrakingGateway, RouteTrakingService],
    }).compile();

    gateway = module.get<RouteTrakingGateway>(RouteTrakingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
