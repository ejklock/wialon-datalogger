import { Device } from 'src/device/entity/device.entity';
import { Parameters } from 'src/utils/interfaces/Parameters';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int8' })
  superClassID: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  items?: Parameters[];

  @Column({ type: 'int8' })
  groupID: number;

  @ManyToMany(() => Device, { nullable: true })
  @JoinTable()
  devices?: Device[];
}
