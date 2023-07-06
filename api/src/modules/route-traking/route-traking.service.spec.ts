import { Test, TestingModule } from '@nestjs/testing';
import { RouteTrakingService } from './route-traking.service';

describe('RouteTrakingService', () => {
  let service: RouteTrakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteTrakingService],
    }).compile();

    service = module.get<RouteTrakingService>(RouteTrakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
