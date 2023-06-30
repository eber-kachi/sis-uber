import { Test, TestingModule } from '@nestjs/testing';
import { GrupotrabajoController } from './grupotrabajo.controller';
import { GrupotrabajoService } from './grupotrabajo.service';

describe('GrupotrabajoController', () => {
  let controller: GrupotrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupotrabajoController],
      providers: [GrupotrabajoService],
    }).compile();

    controller = module.get<GrupotrabajoController>(GrupotrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
