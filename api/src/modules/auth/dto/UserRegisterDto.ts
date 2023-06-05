import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';
import { RoleType } from '../../../common/constants/role-type';

export class UserRegisterDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @Trim()
  // readonly firstName: string;
  //
  @ApiPropertyOptional({ enum: RoleType })
  role?: RoleType;

  @ApiProperty()
  @IsString()
  // @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;

  // @ApiProperty()
  // @Column()
  // // @IsPhoneNumber('ZZ')
  // @IsOptional()
  // phone: string;
}
