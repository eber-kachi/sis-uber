import { forwardRef, Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeRepository } from './viajes.repository';

import { SocioModule } from '../socio/socio.module';
import { ClienteModule } from '../cliente/cliente.module';
import { UserModule } from '../user/user.module';
// import { UserModule } from '../user/user.module';
// import { ClienteModule } from 'modules/cliente/cliente.module';
// import { UserService } from '../user/user.service';
import { ViajeEntity } from './entities/viaje.entity';

@Module({
  imports: [
    // ClienteModule,
    forwardRef(() => SocioModule),
    forwardRef(() => ClienteModule),
    forwardRef(() => UserModule),
    // UserModule,
    TypeOrmModule.forFeature([ViajeEntity]),
  ],
  controllers: [ViajesController],
  providers: [ViajesService, ViajeRepository],
  exports: [ViajesService],
})
export class ViajesModule {}
