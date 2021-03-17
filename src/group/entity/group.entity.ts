import { Device } from 'src/device/entity/device.entity';
import { Parameters } from 'src/utils/interfaces/Parameters';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
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

  @Exclude()
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  items?: Parameters[];

  @Column({ type: 'int8', unique: true })
  @Index({ unique: true })
  groupID: number;

  @ManyToMany(() => Device, { nullable: true, eager: true })
  @JoinTable()
  devices?: Device[];
}
