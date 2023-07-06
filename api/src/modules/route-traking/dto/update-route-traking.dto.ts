import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteTrakingDto } from './create-route-traking.dto';

export class UpdateRouteTrakingDto extends PartialType(CreateRouteTrakingDto) {
  id: number;
}
