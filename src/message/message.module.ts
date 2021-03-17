import { Device } from 'src/device/entity/device.entity';
import { LatestDeviceMessage } from 'src/latestdevicemessage/entity/latestdevicemessage.entity';
import { DeviceService } from 'src/device/service/device/device.service';
import { WialonService } from 'src/wialon/service/wialon/wialon.service';
import { MessageService } from './service/message/message.service';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, LatestDeviceMessage, Device]),
    CacheModule.register(),
  ],

  controllers: [],
  providers: [MessageService, WialonService, DeviceService],
})
export class MessageModule {}
