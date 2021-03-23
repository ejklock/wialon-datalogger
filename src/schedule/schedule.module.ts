import { GrouptaskService } from './../grouptask/grouptask.service';
import { MessageService } from 'src/message/service/message/message.service';
import { DeviceService } from './../device/service/device/device.service';
import { WialonService } from './../wialon/service/wialon/wialon.service';
import { Message } from './../message/entity/message.entity';
import { LatestDeviceMessage } from './../latestdevicemessage/entity/latestdevicemessage.entity';
import { Device } from 'src/device/entity/device.entity';
import { GroupService } from './../group/service/group/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Group } from 'src/group/entity/group.entity';
import { Grouptask } from 'src/grouptask/entity/grouptask.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Device,
      LatestDeviceMessage,
      Message,
      Grouptask,
    ]),
    CacheModule.register(),
  ],
  providers: [
    ScheduleService,
    GroupService,
    WialonService,
    DeviceService,
    MessageService,
    GrouptaskService,
  ],
})
export class ScheduleModule {}
