import { Device } from './../device/entity/device.entity';
import { LatestDeviceMessage } from './../latestdevicemessage/entity/latestdevicemessage.entity';
import { MessageService } from 'src/message/service/message/message.service';
import { WialonService } from './../wialon/service/wialon/wialon.service';
import { GroupService } from './../group/service/group/group.service';
import { Group } from './../group/entity/group.entity';
import { Grouptask } from './entity/grouptask.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { GrouptaskController } from './grouptask.controller';
import { GrouptaskService } from './grouptask.service';
import { DeviceService } from 'src/device/service/device/device.service';
import { Message } from 'src/message/entity/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Grouptask,
      Message,
      LatestDeviceMessage,
      Device,
    ]),
    CacheModule.register(),
  ],
  controllers: [GrouptaskController],
  providers: [
    GrouptaskService,
    GroupService,
    WialonService,
    DeviceService,
    MessageService,
  ],
})
export class GrouptaskModule {}
