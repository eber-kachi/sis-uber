import { Module } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { VeiculoController } from './veiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoRepository } from './veiculo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VeiculoRepository])],
  controllers: [VeiculoController],
  providers: [VeiculoService],
  exports: [VeiculoService],
})
export class VeiculoModule {}
