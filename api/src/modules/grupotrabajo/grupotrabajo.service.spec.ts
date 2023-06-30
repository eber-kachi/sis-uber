import { Test, TestingModule } from '@nestjs/testing';
import { GrupotrabajoService } from './grupotrabajo.service';

describe('GrupotrabajoService', () => {
  let service: GrupotrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrupotrabajoService],
    }).compile();

    service = module.get<GrupotrabajoService>(GrupotrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
