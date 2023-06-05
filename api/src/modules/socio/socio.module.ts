import { forwardRef, Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioRepository } from './socio.repository';
import { UserModule } from '../user/user.module';
import { SocioEntity } from './entities/socio.entity';

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([SocioEntity])],
  controllers: [SocioController],
  providers: [SocioService, SocioRepository],
  exports: [SocioService],
})
export class SocioModule {}
