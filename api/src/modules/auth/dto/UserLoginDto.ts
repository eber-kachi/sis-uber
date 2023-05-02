'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  // @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
