import { Device } from 'src/device/entity/device.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LatestDeviceMessage {
  public static convertToDate(unixTime: number) {
    return new Date(unixTime * 1000);
  }

  public getLinuxTime() {
    return Math.floor(this.latestMessageTime.getTime() / 1000);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device, (device) => device.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deviceId' })
  @Index({ unique: true })
  device: Device;

  @Column()
  latestMessageTime: Date;

  @Column()
  latestMessageRegistrationTime: Date;
}
