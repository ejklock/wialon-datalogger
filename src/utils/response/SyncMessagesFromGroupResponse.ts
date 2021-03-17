import { Device } from 'src/device/entity/device.entity';

export interface SyncMessagesFromGroupResponse {
  device: Device;
  highestMessageTime: number;
  highestMessageRegistrationTime: number;
  newSynchronizedMessages: number;
}
