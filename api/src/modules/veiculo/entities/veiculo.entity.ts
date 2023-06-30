import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { VeiculoDto } from '../dto/create-veiculo.dto';

@Entity({ name: 'veiculos' })
export class VeiculoEntity extends AbstractEntity<VeiculoDto> {
  @Column({ nullable: true })
  placa: string;
  @Column({ nullable: true })
  modelo: string;
  @Column({ nullable: true })
  marca: string;
  @Column({ nullable: true })
  color: string;
  @Column({ nullable: true })
  foto: string;
  @Column({ nullable: true })
  capacidad: string;
  @Column({ nullable: true })
  caracteristicas: string;
  @Column({ nullable: true })
  anio: string;

  @Column({ nullable: true, type: 'varchar', length: '50' })
  n_movil: string;

  dtoClass = VeiculoDto;
}
