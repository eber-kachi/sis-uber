import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { SocioDto } from '../dto/create-socio.dto';
import { UserEntity } from '../../user/user.entity';
import { ViajeEntity } from '../../viajes/entities/viaje.entity';
import { VeiculoEntity } from '../../veiculo/entities/veiculo.entity';

@Entity({ name: 'socios' })
export class SocioEntity extends  AbstractEntity<SocioDto> {
  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  apellidos: string;

  @Column({ nullable: false })
  ci: string;

  @Column({ nullable: false })
  nacionalidad: string;

  @Column({ nullable: false })
  foto: string;

  @Column({ nullable: true }) // se usara para saber si el socio esta con un cliente con una carrera
  estado: string;

  // licencia
  @Column({ nullable: false, type: 'date' })
  emision: Date;

  @Column({ nullable: false, type: 'date' })
  vencimiento: Date;

  @Column({ nullable: false })
  nroLicencia: string;

  @Column({ nullable: false })
  categoria: string;

  // @Column()
  // userId: string;

  @OneToOne(() => UserEntity ,{ cascade:true })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => ViajeEntity, (data) => data.socio)
  viajes: ViajeEntity[];

  @OneToOne(() => VeiculoEntity, { nullable: true })
  @JoinColumn()
  veiculo?: VeiculoEntity | null;

  dtoClass = SocioDto;
}
