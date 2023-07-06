import { Column, Entity, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RouteTrakingDto } from '../dto/routeTraking.dto';

@Entity({ name: 'seguimiento-vehiculo' })
export class RouteTrakingEntity extends AbstractEntity<RouteTrakingDto> {
  @Column({ nullable: true, type: 'double precision' })
  latitude: number;
  @Column({ nullable: true, type: 'double precision' })
  longitude: number;

  //   @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  //   @JoinColumn()
  //   user: UserEntity;

  //   @OneToMany(() => ViajeEntity, (data) => data.socio)
  //   viajes: ViajeEntity[];

  //   @OneToOne(() => VeiculoEntity, { nullable: true })
  //   @JoinColumn()
  //   veiculo?: VeiculoEntity | null;

  //   @Column({ nullable: true, type: 'varchar' })
  //   grupotrabajo_id: string;

  //   // relacion con grupotrabajo
  //   @ManyToOne(() => GrupotrabajoEntity, (data) => data.socios, { nullable: true })
  //   grupotrabajo?: GrupotrabajoEntity;

  dtoClass = RouteTrakingDto;
}
