import { Device } from 'src/device/entity/device.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LatestDeviceMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device, (device) => device.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @Column()
  latestMessageTime: Date;

  @Column()
  latestMessageRegistrationTime: Date;
}
