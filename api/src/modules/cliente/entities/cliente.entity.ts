import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ClienteDto } from '../dto/create-cliente.dto';
import { UserEntity } from '../../user/user.entity';
import { ViajeEntity } from '../../viajes/entities/viaje.entity';

@Entity({ name: 'clientes' })
export class ClienteEntity extends AbstractEntity<ClienteDto> {
  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  apellidos: string;

  // @Column({ nullable: true })
  // ci: string;

  @Column({ nullable: true })
  direccionMadre: string | null;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => ViajeEntity, (data) => data.cliente)
  viajes: ViajeEntity[];

  dtoClass = ClienteDto;
}
