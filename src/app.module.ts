import { Message } from './message/entity/message.entity';
import { Group } from 'src/group/entity/group.entity';
import { GroupModule } from './group/group.module';
import { WialonService } from './wialon/service/wialon/wialon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { UserModule } from './user/user.module';
import { DeviceService } from './device/service/device/device.service';
import { ConfigModule } from '@nestjs/config';
import { WialonModule } from './wialon/wialon.module';
import { MessageService } from './message/service/message/message.service';
import { LatestDeviceMessageModule } from './latestdevicemessage/latestdevicemessage.module';
import { LatestDeviceMessage } from './latestdevicemessage/entity/latestdevicemessage.entity';
import { Device } from './device/entity/device.entity';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([LatestDeviceMessage, Device, Message]),
    CacheModule.register(),
    DeviceModule,
    UserModule,
    ConfigModule.forRoot(),
    WialonModule,
    LatestDeviceMessageModule,
    GroupModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, DeviceService, WialonService, MessageService],
})
export class AppModule {}
