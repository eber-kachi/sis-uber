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
  Res,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'decorators/response_message.decorator';
import { ClienteRegisterDto } from './dto/cliente-register.dto';

import type { Response } from 'express';
import { CustomInterceptorIgnore } from '../../interceptors/custom-interceptor-ignore.service';
import { log } from 'console';
@Controller('clientes')
@ApiTags('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cliente Registrado exitosamente.')
  async create(@Body() createClienteDto: ClienteRegisterDto) {
    try {
      // await this.service.findAll()
      // return this.socioService.findAll();
      const createCliente = await this.clienteService.create(createClienteDto);

      return createCliente.toDto();
      // throw new HttpException('Un super error ', HttpStatus.FORBIDDEN);
    } catch (error) {
      console.log(error);
      if (error.message.includes('ER_DUP_ENTRY')) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Email ya existe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
    return this.clienteService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: ClienteDto,
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.clienteService.findOne(id);
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

  @Get('/report/download')
  @CustomInterceptorIgnore()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cliente Registrado exitosamente.')
  // async getTrips(@Param('id') id: string, @Res() res) {
  async getTrips(@Res() res: Response) {
    try {
      const buffer: Buffer = await this.clienteService.reportviajes();
      // return this.clienteService.reportviajes();
      res.set({
        // pdf
        'Content-Type': 'application/pdf',
        // 'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=pdf.pdf`,
        'Content-Length': buffer.length,
        // prevent cache
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      });
      // res.end(buffer);
      console.log(buffer.toString('base64'));

      // res.send(buffer.toString('base64'));
      res.status(200).send({
        content: buffer.toString('base64'),
        filename: 'result.pdf',
        mimeType: 'application/pdf',
      });
      // return new StreamableFile(buffer);
      // res.headers.set('Content-Type', 'application/pdf');
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
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: ClienteDto,
  })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.clienteService.remove(id);
  }
}
