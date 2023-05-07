import { PartialType } from '@nestjs/swagger';
import { ClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(ClienteDto) {}
