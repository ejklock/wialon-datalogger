import { Group } from 'src/group/entity/group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Grouptask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  status: boolean;

  @OneToOne(() => Group, (group) => group.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  group: Group;
}
