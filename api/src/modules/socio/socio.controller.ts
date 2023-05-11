import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('socios')
@ApiTags('socios')
export class SocioController {
  constructor(private socioService: SocioService) {
  }

  @Post()
  async create(@Body() createSocioDto: any) {
    const createSocio = await this.socioService.create(createSocioDto);
    return createSocio.toDto();
  }

  @Get()
  findAll() {
    return this.socioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocioDto: UpdateSocioDto) {
    return this.socioService.update(+id, updateSocioDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return  await this.socioService.remove(id);
  }
}
