import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  StreamableFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { log } from 'console';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':name')
  // @Header('Content-Type', 'application/json')
  getbynamefile(@Param('name') name: string): StreamableFile {
    console.log(process.cwd());
    const dir = process.env.UPLOAD_LOCATION;
    console.log(join(process.cwd(), '/' + dir, name));
    const path = join(process.cwd(), '/' + dir);
    if (existsSync(path)) {
      const file = createReadStream(join(path, name));
      // buscar si existe el drectorio o el archivo
      return new StreamableFile(file);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: `No existe  => ${name}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // @Get()
  // @Header('Content-Type', 'application/json')
  // @Header('Content-Disposition', 'attachment; filename="package.json"')
  // getStaticFile(): StreamableFile {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   return new StreamableFile(file);
  // }
  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
