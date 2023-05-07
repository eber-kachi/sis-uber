import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { VeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  async create(@Body() createVeiculoDto: any) {
    const createSocio = await this.veiculoService.create(createVeiculoDto);
    return createSocio.toDto();
  }

  @Get()
  findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVeiculoDto: UpdateVeiculoDto) {
    return this.veiculoService.update(+id, updateVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veiculoService.remove(id);
  }
}
