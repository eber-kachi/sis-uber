'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { RouteTrakingEntity } from '../entities/route-traking.entity';

export class RouteTrakingDto extends AbstractDto {
  @ApiPropertyOptional()
  latitude: number;

  constructor(entity: RouteTrakingEntity) {
    super(entity);
    this.latitude = entity.latitude;
  }
}
