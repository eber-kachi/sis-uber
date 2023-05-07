import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { PageDto } from '../../common/dto/PageDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
// import { TranslationService } from '../../shared/services/translation.service';
import { UserDto } from './dto/UserDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService, // private readonly translationService: TranslationService,
  ) {}

  @Post()
  async create(@Body() createUserDto: any) {
    console.log(createUserDto);
    const createUser = await this.userService.create(createUserDto);
    return createUser.toDto();
  }

  @Get('admin')
  // @Auth(RoleType.USER)
  @HttpCode(HttpStatus.OK)
  async admin(@AuthUser() user: UserEntity): Promise<string> {
    return `${user.email}`;
  }

  @Get()
  // @Auth(RoleType.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get('/all')
  getAll() {
    return this.userService.findAll();
  }

  @Get('/roles')
  // @Auth(RoleType.USER)
  @HttpCode(HttpStatus.OK)
  getRoles() {
    const rols = Object.keys(RoleType).filter((item) => {
      return isNaN(Number(item));
    });
    return rols;
  }

  @Get(':id')
  @Auth(RoleType.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: string): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Put(':id')
  updateState(@Param('id') id: string) {
    return this.userService.updateActive(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultorioDto: any) {
    console.log(updateConsultorioDto);
    return this.userService.update(id, updateConsultorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
