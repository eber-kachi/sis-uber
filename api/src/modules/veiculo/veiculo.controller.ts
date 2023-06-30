import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { VeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiFile } from '../../decorators/swagger.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'providers/multerOptions ';
import { IFile } from 'interfaces/IFile';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile([{ name: 'foto' }])
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async create(@Body() createVeiculoDto: any, @UploadedFile() file: IFile) {
    if (file) {
      const createSocio = await this.veiculoService.create({
        ...createVeiculoDto,
        foto: file.filename,
      });
      return createSocio.toDto();
    }
    const createSocio = await this.veiculoService.create(createVeiculoDto);
    return createSocio.toDto();
  }

  @Get()
  findAll() {
    return this.veiculoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.veiculoService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiFile([{ name: 'foto' }])
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
    @UploadedFile() file: IFile,
  ) {
    if (file) {
      return this.veiculoService.update(id, { ...updateVeiculoDto, foto: file.filename });
    }
    return this.veiculoService.update(id, updateVeiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.veiculoService.remove(id);
  }
}
