import { Message } from 'src/message/entity/message.entity';
import { WialonService } from './../wialon/service/wialon/wialon.service';
import { Module, CacheModule } from '@nestjs/common';
import { DeviceController } from './controller/device.controller';
import { DeviceService } from './service/device/device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entity/device.entity';
import { LatestDeviceMessage } from 'src/latestdevicemessage/entity/latestdevicemessage.entity';
import { Group } from 'src/group/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LatestDeviceMessage, Device, Message]),
    CacheModule.register(),
  ],

  controllers: [DeviceController],
  providers: [DeviceService, WialonService],
})
export class DeviceModule {}
