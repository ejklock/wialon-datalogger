import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { GroupService } from './service/group/group.service';
import { Group } from './entity/group.entity';
import { WialonService } from 'src/wialon/service/wialon/wialon.service';
import { GroupController } from './controller/group.controller';
import { DeviceService } from 'src/device/service/device/device.service';
import { Device } from 'src/device/entity/device.entity';
import { LatestDeviceMessage } from 'src/latestdevicemessage/entity/latestdevicemessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Device, LatestDeviceMessage]),
    CacheModule.register(),
  ],
  providers: [GroupService, WialonService, DeviceService],
  controllers: [GroupController],
})
export class GroupModule {}
