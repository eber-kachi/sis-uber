import { forwardRef, Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioRepository } from './socio.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ forwardRef(() => UserModule), TypeOrmModule.forFeature([SocioRepository])],
  controllers: [SocioController],
  providers: [SocioService],
  exports: [SocioService],
})
export class SocioModule {}
