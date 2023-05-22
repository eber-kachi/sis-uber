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
export class ClienteRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly nombres: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
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
