import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../../common/constants/role-type';
import { IsString, MinLength } from 'class-validator';

export class UserUpdateDto {
  // @ApiPropertyOptional()
  // readonly firstName: string;

  // @ApiPropertyOptional()
  // readonly lastName: string;

  @ApiPropertyOptional({ enum: RoleType })
  readonly role?: RoleType;

  @ApiPropertyOptional()
  readonly email?: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password?: string;
}
