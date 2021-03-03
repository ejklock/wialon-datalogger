import { Message } from 'src/message/entity/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int8' })
  superClassID: number;

  @Column({ type: 'int8' })
  deviceID: number;

  @Column({ type: 'int8' })
  measureUnit: number;

  @Column({ nullable: true })
  deviceUuid?: string;

  @Column({ nullable: true })
  deviceUuid2?: string;

  @Column({ nullable: true })
  hardwareType?: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  phoneNumber2?: string;

  @Column({ nullable: true })
  active?: boolean;

  @Column({ type: 'int8' })
  desactivationTime: number;

  @Column({ type: 'int8' })
  currentUserAccessLevel: number;

  @OneToMany(() => Message, (message) => message.device)
  measures: Message[];
}
