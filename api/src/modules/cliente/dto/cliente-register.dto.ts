import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidationOptions,
} from 'class-validator';
import { Column } from 'typeorm';

import { Trim } from '../../../decorators/transforms.decorator';
import { RoleType } from 'common/constants/role-type';
import { Transform } from 'class-transformer';
export class ClienteRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Transform(({ value }) => String(value).split(' ').map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(' '))
  readonly nombres: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Transform(({ value }) => String(value).split(' ').map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(' '))
  readonly apellidos: string;

  @ApiPropertyOptional({ enum: RoleType })
  readonly role: RoleType;

  @ApiProperty()
  @IsString()
  @IsEmail()
  // @IsEmail({ ValidationOptions: { message: 'Debe ser un email valido.' } })
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
