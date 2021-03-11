import { LatestDeviceMessage } from './../../../latestdevicemessage/entity/latestdevicemessage.entity';
import { WialonService } from './../../../wialon/service/wialon/wialon.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/entity/message.entity';
import { Device } from 'src/device/entity/device.entity';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
@Injectable()
export class DeviceService {
  protected latestRegister: LatestDeviceMessage;
  constructor(
    private wialonService: WialonService,
    @InjectRepository(LatestDeviceMessage)
    private latestDeviceMessageRepository: Repository<LatestDeviceMessage>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  public async getAllDevices(flags = 1) {
    return await this.wialonService.getAllDevices();
  }

  public async getAllDevices2(flags = 1) {
    return await this.wialonService.getAllDevices2();
  }

  public async createOrUpdateDevices(devices: Device[]) {
    try {
      const upSaved = await TypeOrmUpsert(
        this.deviceRepository,
        devices,
        'deviceID',
        { doNotUpsert: ['deviceID', 'id'] },
      );
      return upSaved;
    } catch (error) {
      console.log(error);
    }
  }

  protected convertToUnixTime(time = new Date()) {
    return Math.floor(time.getTime() / 1000);
  }

  protected async getLatestDeviceMessage(deviceId) {
    const result = await this.latestDeviceMessageRepository.findOne({
      where: {
        device: deviceId,
      },
      order: {
        latestMessageTime: 'DESC',
      },
    });

    if (result) {
      this.latestRegister = result;

      console.log(
        this.convertToUnixTime(
          this.latestRegister.latestMessageRegistrationTime,
        ),
      );

      return this.latestRegister;
    }

    return null;
  }

  protected async registerLatestDeviceMessage(deviceId, latest: Date) {
    if (this.latestRegister) {
      this.latestRegister.latestMessageRegistrationTime = latest;
      this.latestRegister.latestMessageTime = latest;
      await this.latestDeviceMessageRepository.save(this.latestRegister);
    } else {
      await this.latestDeviceMessageRepository.save({
        device: deviceId,
        latestMessageTime: latest,
        latestMessageRegistrationTime: latest,
      });
    }
  }

  protected getLatestDeviceMessageRegister(messages = []): Message {
    return messages.reduce((prev, current) => {
      return prev.messageTime > current.messageTime ? prev : current;
    });
  }

  protected async getLatest(id) {
    const result = await this.getLatestDeviceMessage(id);
    if (result) {
      return this.convertToUnixTime(result.latestMessageRegistrationTime);
    }
    return 1577836800;
  }

  public async getDeviceMessages(
    deviceId,
    id = null,
    timeFrom?,
    timeTo?: Date,
  ) {
    //TODO: VERIFICAR PQ AINDA RETORNA DADOS A PARTIR DO MAIOR VALOR REGISTRADO
    const latest = timeFrom ?? (await this.getLatest(id));
    console.log(latest);

    const messages = await this.wialonService.getMessagesFromDevice(
      id,
      deviceId,
      latest,
      this.convertToUnixTime(timeTo),
    );
    // console.log(messages);

    if (messages.length !== 0) {
      await this.registerLatestDeviceMessage(
        id,
        this.getLatestDeviceMessageRegister(messages).messageRegistrationTime,
      );
    }

    return messages;
  }
}
