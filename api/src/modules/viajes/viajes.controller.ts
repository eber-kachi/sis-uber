import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { CreateViajeClient } from './dto/create-viaje-client';
import { ResponseMessage } from 'decorators/response_message.decorator';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Fetched Stats Succesfully')
  create(@Body() createViajeDto: any) {
    try {
      // await this.service.findAll()
      return this.viajesService.create(createViajeDto);
      // return this.socioService.findAll();
      // throw new HttpException('Un super error ', HttpStatus.FORBIDDEN);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('asignar-socio')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Fetched Stats Succesfully')
  async asignationSocioWithClient(@Body() createViajeDto: any) {
    try {
      // await this.service.findAll()
      return await this.viajesService.asignationSocioWithClient(createViajeDto);
      // return this.socioService.findAll();
      // throw new HttpException('Un super error ', HttpStatus.FORBIDDEN);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('socio-confirmar-viaje')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Fetched Stats Succesfully')
  async confirmarViajeSocioByViajeId(@Body() createViajeDto: any) {
    try {
      return await this.viajesService.confirmarViajeSocioByViajeId(createViajeDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('change-status-by-id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Fetched Stats Succesfully')
  async changeStatusViajeById(@Body() createViajeDto: any) {
    try {
      return await this.viajesService.changeStatusViajeById(
        createViajeDto.viaje_id,
        createViajeDto.estado,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get()
  findAll() {
    return this.viajesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.viajesService.findOne(id);
  }
  // obtener todos los viajes segun el socio_id
  @Get('get-by-cliente-id/:id')
  async findAllByClientId(@Param('id') id: string) {
    return await this.viajesService.findAllByClientId(id);
  }
  // obtener los ultimos 5 viajes
  @Get('/get-last/trip-by?')
  async getLastTrip(@Query('socio_id') socio_id: string, @Query('cliente_id') cliente_id: string) {
    try {
      return await this.viajesService.getLastTrip(socio_id, cliente_id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajesService.update(+id, updateViajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajesService.remove(+id);
  }
}
