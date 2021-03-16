import { Device } from 'src/device/entity/device.entity';
import { Parameters } from 'src/utils/interfaces/Parameters';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageTime: Date;

  @Column()
  messageType: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ type: 'double precision' })
  alt: number;

  @Column({ type: 'int8', nullable: true })
  inputData: number;

  @Column({ type: 'int8', nullable: true })
  outPutData: number;

  @Column()
  lbsMessageCheckSum: number;

  @Column()
  messageRegistrationTime: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  parameters?: Parameters;

  @Column()
  @Index({ unique: true })
  messageHash?: string;

  @ManyToOne(() => Device, (device) => device.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  device: Device;
}
