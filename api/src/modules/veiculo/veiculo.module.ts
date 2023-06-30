import { Module } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { VeiculoController } from './veiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoRepository } from './veiculo.repository';
import { VeiculoEntity } from './entities/veiculo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../../providers/multerOptions ';

@Module({
  imports: [
    TypeOrmModule.forFeature([VeiculoEntity]),
    MulterModule.register({
      dest: multerConfig.dest,
    }),
  ],
  controllers: [VeiculoController],
  providers: [VeiculoService, VeiculoRepository],
  exports: [VeiculoService],
})
export class VeiculoModule {}
