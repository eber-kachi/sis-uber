import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { EstadoViaje } from '../../../common/constants/estado-viaje';

export class CreateViajeClient {
  @ApiPropertyOptional()
  user_email: string;

  @ApiProperty({ enum: EstadoViaje })
  estado: string;

  @ApiProperty()
  start_latitude: number;

  @ApiProperty()
  start_longitude: number;
  @ApiProperty()
  end_latitude: number;
  @ApiProperty()
  end_longitude: number;

  @ApiProperty()
  initial_address: string;
  @ApiProperty()
  final_address: string;

  //   @ApiProperty()
  //   client_id: string;
}
