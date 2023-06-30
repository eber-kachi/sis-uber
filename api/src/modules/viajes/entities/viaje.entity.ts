import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ViajeDto } from '../dto/create-viaje.dto';
import { ClienteEntity } from '../../cliente/entities/cliente.entity';
import { SocioEntity } from '../../socio/entities/socio.entity';

@Entity({ name: 'viajes' })
export class ViajeEntity extends AbstractEntity<ViajeDto> {
  //   @Column({ nullable: true })
  //   nombres: string;
  //   @Column({ nullable: true })
  //   nombres: string;
  //   @Column({ nullable: true })
  //   nombres: string;
  //   @Column({ nullable: true })
  //   nombres: string;
  //   @Column({ nullable: true })
  //   nombres: string;
  //   @Column({ nullable: true })
  //   nombres: string;

  @Column({ nullable: true, type: 'float', default: 0 })
  distancia_recorrida: string;
  @Column({ nullable: true, type: 'datetime' })
  fecha: string;
  @Column({ nullable: true })
  estado: string;
  @Column({ nullable: true, type: 'int' })
  calificacion: number;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  initial_address: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  final_address: string;

  @Column({ nullable: true, type: 'datetime' })
  start_time: string;

  @Column({ nullable: true, type: 'datetime' })
  end_time: string;
  //posicion  inicial
  @Column({ nullable: true, type: 'double precision' })
  start_latitude: number;
  @Column({ nullable: true, type: 'double precision' })
  start_longitude: number;

  // posicion final
  @Column({ nullable: true, type: 'double precision' })
  end_latitude: number;
  @Column({ nullable: true, type: 'double precision' })
  end_longitude: number;

  @ManyToOne(() => ClienteEntity, (data) => data.viajes)
  cliente: ClienteEntity;

  @ManyToOne(() => SocioEntity, (data) => data.viajes, { nullable: true })
  socio: SocioEntity;

  dtoClass = ViajeDto;
}
