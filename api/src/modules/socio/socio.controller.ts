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
} from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'decorators/response_message.decorator';
import { AuthUserInterceptor } from 'interceptors/auth-user-interceptor.service';
// import { AuthGuard } from 'guards/auth.guard';
// import { AuthGuard } from '../../guards/auth.guard';

@Controller('socios')
@ApiTags('socios')
export class SocioController {
  constructor(private socioService: SocioService) {}

  @Post()
  async create(@Body() createSocioDto: any) {
    const createSocio = await this.socioService.create(createSocioDto);
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

      if (createSocioDto.socio_id.match(validRegex)) {
        const user = await this.socioService.findByEmail(createSocioDto.socio_id);
        if (user.socio) {
          return await this.socioService.changeState(
            user.socio.id,
            createSocioDto.state,
            createSocioDto.location,
          );
        }
      }
      return await this.socioService.changeState(createSocioDto.socio_id, createSocioDto.state);
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
  update(@Param('id') id: string, @Body() updateSocioDto: UpdateSocioDto) {
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
}
