import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrupotrabajoService } from './grupotrabajo.service';
import { CreateGrupotrabajoDto } from './dto/create-grupotrabajo.dto';
import { UpdateGrupotrabajoDto } from './dto/update-grupotrabajo.dto';

@Controller('grupotrabajos')
export class GrupotrabajoController {
  constructor(private readonly grupotrabajoService: GrupotrabajoService) { }

  @Post()
  create(@Body() createGrupotrabajoDto: any) {
    console.log(createGrupotrabajoDto);
    return this.grupotrabajoService.create(createGrupotrabajoDto);
  }

  @Get()
  findAll() {
    return this.grupotrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupotrabajoService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGrupotrabajoDto: any) {
    return await this.grupotrabajoService.update(id, updateGrupotrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grupotrabajoService.remove(id);
  }
}
