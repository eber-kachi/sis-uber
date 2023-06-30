import { forwardRef, Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioRepository } from './socio.repository';
import { UserModule } from '../user/user.module';
import { SocioEntity } from './entities/socio.entity';
import { GrupotrabajoModule } from 'modules/grupotrabajo/grupotrabajo.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'providers/multerOptions ';

@Module({
  imports: [
    forwardRef(() => UserModule),
    GrupotrabajoModule,
    TypeOrmModule.forFeature([SocioEntity]),
    MulterModule.register({
      dest: multerConfig.dest,
    }),
  ],
  controllers: [SocioController],
  providers: [SocioService, SocioRepository],
  exports: [SocioService],
})
export class SocioModule {
  /**
   *
   */
  constructor() {}
}
