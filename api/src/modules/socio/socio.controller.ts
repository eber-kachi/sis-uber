/* eslint-disable prettier/prettier */
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
  UseInterceptors,
  UseGuards,
  Req,
  UploadedFile,
  Res,
  Logger,
} from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { ResponseMessage } from 'decorators/response_message.decorator';
import { AuthUserInterceptor } from 'interceptors/auth-user-interceptor.service';
// import { AuthGuard } from 'guards/auth.guard';
// import { AuthGuard } from '../../guards/auth.guard';
import { ApiFile } from '../../decorators/swagger.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'interfaces/IFile';
import { diskStorage } from 'multer';
import { multerOptions } from '../../providers/multerOptions ';
import {
  differenceInHours,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  parseISO,
} from 'date-fns';
import { CustomInterceptorIgnore } from 'interceptors/custom-interceptor-ignore.service';
import type { Response } from 'express';

@Controller('socios')
@ApiTags('socios')
export class SocioController {
  constructor(private socioService: SocioService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile([{ name: 'foto' }])
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async create(@Body() createSocioDto: any, @UploadedFile() file?: IFile): Promise<any> {
    console.log(createSocioDto);

    if (file) {
      //borrar la otra foto que había
      return (await this.socioService.create({ ...createSocioDto, foto: file.filename })).toDto();
    }

    const createSocio = await this.socioService.create(createSocioDto);
    // console.log(createSocio);
    // return this.socioService.update(id, updateSocioDto);

    return createSocio.toDto();
  }

  @Post('add-car')
  async addCar(@Body() createSocioDto: any) {
    return await this.socioService.addcardBysocioid(createSocioDto);
  }

  @Post('change-state')
  async changeState(@Body() createSocioDto: { socio_id: string; state: string; location: any }) {
    try {
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      // aqui buscar  al socio y ver en que  grupo
      // de trabajo se encuentra y segun eso ver
      // si podemos actualizarle o mandarle un mensaje

      if (createSocioDto.socio_id.match(validRegex)) {
        const user = await this.socioService.findByEmail(createSocioDto.socio_id);
        if (!user.socio.activo) {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              message: 'Usuario no activo. consulte al administrador.',
            },
            HttpStatus.FORBIDDEN,
          );
        }

        if (user.socio && createSocioDto.state === 'SINSERVICO') {
          return await this.socioService.changeState(
            user.socio.id,
            createSocioDto.state,
            createSocioDto.location,
          );
        }

        if (user.socio) {
          const socio = await this.socioService.findOne(user.socio.id);
          const time = 24 * 60 * 60 * 1000;
          const fechaActual =
            new Date().getHours() >= 0 && new Date().getHours() <= 5
              ? new Date(new Date().getTime() - time)
              : new Date();

          const fechaActualString = format(fechaActual, 'yyyy-MM-dd HH:mm:ss');

          if (socio.grupotrabajo) {
            const fechaActualStringIn =
              format(fechaActual, 'yyyy-MM-dd') + ' ' + socio.grupotrabajo.hora_inicio;
            const fechaActualStringFin = format(
              new Date(fechaActualStringIn).getTime() +
              socio.grupotrabajo.hora_fin * 60 * 60 * 1000,
              // fechaActual.setHours(socio.grupotrabajo.hora_fin),
              'yyyy-MM-dd HH:mm:ss',
            );

            const esHorariovalidoParaTrabajar = this.isWorkingHours(
              fechaActualStringIn,
              fechaActualStringFin,
              fechaActualString,
            );
            console.log(esHorariovalidoParaTrabajar);
            if (!esHorariovalidoParaTrabajar) {
              throw new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  message: 'No es tu horario de trabajo.',
                },
                HttpStatus.FORBIDDEN,
              );
            }
          }

          return await this.socioService.changeState(
            user.socio.id,
            createSocioDto.state,
            createSocioDto.location,
          );
        }
      }

      const socio = await this.socioService.findOne(createSocioDto.socio_id);
      const time = 24 * 60 * 60 * 1000;
      const fechaActual =
        new Date().getHours() >= 0 && new Date().getHours() <= 5
          ? new Date(new Date().getTime() - time)
          : new Date();
      const fechaActualString = format(fechaActual, 'yyyy-MM-dd HH:mm:ss');

      console.log(fechaActualString);
      if (socio.grupotrabajo) {
        const fechaActualStringIn =
          format(fechaActual, 'yyyy-MM-dd') + ' ' + socio.grupotrabajo.hora_inicio;
        const fechaActualStringFin = format(
          new Date(fechaActualStringIn).getTime() + socio.grupotrabajo.hora_fin * 60 * 60 * 1000,
          // fechaActual.setHours(socio.grupotrabajo.hora_fin),
          'yyyy-MM-dd HH:mm:ss',
        );

        const esHorariovalidoParaTrabajar = this.isWorkingHours(
          fechaActualStringIn,
          fechaActualStringFin,
          fechaActualString,
        );
        console.log(esHorariovalidoParaTrabajar);
        if (!esHorariovalidoParaTrabajar) {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              message: 'No es tu horario de trabajo.',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
      return await this.socioService.changeState(createSocioDto.socio_id, createSocioDto.state);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: error.message || 'Ocurrio un problema al procesar la informacion.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get()
  // @UseGuards(AuthGuard)
  // @UseInterceptors(AuthUserInterceptor)
  // @ApiBearerAuth()
  @ResponseMessage('Fetched Stats Succesfully')
  findAll() {
    try {
      // await this.service.findAll()
      return this.socioService.findAll();
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
  @Get('/report/download')
  @CustomInterceptorIgnore()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Cliente Registrado exitosamente.')
  // async getTrips(@Param('id') id: string, @Res() res) {
  async getTrips(@Res() res: Response) {
    try {
      const buffer: Buffer = await this.socioService.reportviajes();
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

      console.log(buffer.toString('base64'));

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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: SocioDto,
  })
  async findOne(@Param('id') id: string) {
    return await this.socioService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: SocioDto,
  })
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiConsumes('multipart/form-data')
  @ApiFile([{ name: 'foto' }])
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateSocioDto: UpdateSocioDto,
    @UploadedFile() file: IFile,
  ) {
    console.log({ file, updateSocioDto });
    if (file) {
      //borrar la otra foto que habia
      return this.socioService.update(id, { ...updateSocioDto, foto: file.filename });
    }

    return this.socioService.update(id, updateSocioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.socioService.remove(id);
  }
  @Get('/enabled/:id')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(AuthUserInterceptor)
  // @ApiBearerAuth()
  @ResponseMessage('Fetched Stats Succesfully')
  enabled(@Param('id') socio_id: string) {
    try {
      return this.socioService.enabled(socio_id);
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

  @Get('/get-by-status/:status')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(AuthUserInterceptor)
  // @ApiBearerAuth()
  @ResponseMessage('Fetched Stats Succesfully')
  findAllByState(@Param('status') status: string) {
    try {
      return this.socioService.findAllByState(status);
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
  @Get('/get/all-with/status')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(AuthUserInterceptor)
  // @ApiBearerAuth()
  @ResponseMessage('Fetched Stats Succesfully')
  getAllWithStatus() {
    try {
      return this.socioService.getAllWithStatus();
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

  isWorkingHours(startTime: string, endTime: string, currentHour: string): boolean {
    // const vaidation =
    //   isValid(parseISO(startTime)) && isValid(parseISO(endTime)) && isValid(parseISO(currentHour));
    // if (vaidation) {
    //   const startTimeDate = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    //   const endTimeDate = parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    //   const currentHourDate = parse(currentHour, 'yyyy-MM-dd HH:mm:ss', new Date());

    //   // const isafter = isAfter(new Date(), startTimeDate);
    //   // const isbefore = isBefore(new Date(), endTimeDate);
    //   const isafter = isAfter(currentHourDate, startTimeDate);
    //   const isbefore = isBefore(currentHourDate, endTimeDate);
    //   const isvalidate = isafter && isbefore;
    //   return isvalidate;

    // }

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const currentHourDate = new Date();

    const startTimeTimestamp = startTimeDate.getTime();
    const endTimeTimestamp = endTimeDate.getTime();
    const currentHourTimestamp = currentHourDate.getTime();

    const isWorkingHours =
      currentHourTimestamp >= startTimeTimestamp && currentHourTimestamp <= endTimeTimestamp;

    return isWorkingHours;

    // Check if the current hour is between the start time and end time.
    // return isBetween(currentHourDate, startTimeDate, endTimeDate);

    // return isAfter(currentHour, startTime) && isBefore(currentHour, endTime);
    // return isAfter(currentHourDate, startTimeDate) && isBefore(currentHourDate, endTimeDate);
  }
}
