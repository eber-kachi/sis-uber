import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
// import { VirtualColumn } from '../../decorators/virtual-column.decorator';
import { UserDto } from './dto/UserDto';
import { Exclude } from 'class-transformer';
import { ClienteEntity } from 'modules/cliente/entities/cliente.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  // @Column({ nullable: true })
  // firstName: string;

  // @Column({ nullable: true })
  // lastName: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ default: true })
  activo: boolean;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  // @Column({ nullable: true })
  // phone: string;

  // @Column({ nullable: true })
  // avatar: string;

  // @VirtualColumn()
  // fullName: string;
  @OneToOne((type) => ClienteEntity, (customer) => customer.user)
  cliente: ClienteEntity;

  dtoClass = UserDto;
}
