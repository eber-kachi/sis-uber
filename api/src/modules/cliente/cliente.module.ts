import { Module, forwardRef } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteRepository } from './cliente.repository';
//import { UserRepository } from '../user/user.repository';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule),TypeOrmModule.forFeature([ClienteRepository]), ],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [ClienteService],
})
export class ClienteModule {}
