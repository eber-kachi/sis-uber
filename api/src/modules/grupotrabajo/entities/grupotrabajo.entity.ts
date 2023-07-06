import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { GrupoTrabajoDTO } from '../dto/grupoTrabajo.dto';
import { SocioEntity } from 'modules/socio/entities/socio.entity';

@Entity({ name: 'grupotrabajos' })
export class GrupotrabajoEntity extends AbstractEntity<GrupoTrabajoDTO> {
  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true, type: 'time' })
  hora_inicio: string;

  @Column({ nullable: true, type: 'int' })
  hora_fin: number; // horas de trabajo  ejemplo inicio 06:00 + 15 horas de trabajo

  // relacion de grupotrabajo con socio
  @OneToMany(() => SocioEntity, (socio) => socio.grupotrabajo)
  socios: SocioEntity[];
  dtoClass = GrupoTrabajoDTO;
}
