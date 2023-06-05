import { Module, forwardRef } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteRepository } from './cliente.repository';
//import { UserRepository } from '../user/user.repository';
import { UserModule } from 'modules/user/user.module';
import { ClienteEntity } from './entities/cliente.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([ClienteEntity]),
    // PDFModule.register({
    //   view: {
    //     root: '/path/to/template',
    //     engine: 'pug',
    //   },
    // }),
  ],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  exports: [ClienteService],
})
export class ClienteModule {}
