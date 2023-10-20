'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @ApiPropertyOptional()
  id?: string | null | undefined;

  createdAt: Date;
  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id || '';
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
