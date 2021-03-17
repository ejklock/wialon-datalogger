import { SyncMessagesFromGroupResponse } from './../../../utils/response/SyncMessagesFromGroupResponse';
import { LatestDeviceMessage } from 'src/latestdevicemessage/entity/latestdevicemessage.entity';
import { DeviceService } from 'src/device/service/device/device.service';
import { Group } from 'src/group/entity/group.entity';
import { WialonService } from 'src/wialon/service/wialon/wialon.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    private wialonService: WialonService,
    private deviceService: DeviceService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(LatestDeviceMessage)
    private latestDeviceMessageRepository: Repository<LatestDeviceMessage>,
  ) {}
  public async createOrUpdateMessages(messages: Message[]) {
    const result = await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values(messages)
      .onConflict(`("messageHash") DO NOTHING`)
      .returning(['id', 'messageTime'])
      .execute();

    const created = result.identifiers.filter((i) => {
      return i !== undefined;
    }).length;

    return created;
  }

  public async createOrUpdateLatestDeviceMessages(
    latestDevicesMessages: LatestDeviceMessage[],
  ) {
    const result = await this.latestDeviceMessageRepository
      .createQueryBuilder()
      .insert()
      .into(LatestDeviceMessage)
      .values(latestDevicesMessages)
      .onConflict(
        `("deviceId") DO UPDATE SET "latestMessageTime" = excluded."latestMessageTime","latestMessageRegistrationTime" = excluded."latestMessageRegistrationTime"`,
      )
      .returning(['id', 'latestMessageTime', 'latestMessageRegistrationTime'])
      .execute();
    return result;
  }

  public async getAllMessagesFromGroup(group: Group) {
    const groupDevicesMessages = await this.wialonService.getMessagesFromGroup(
      group,
    );
    return groupDevicesMessages;
  }

  protected async saveLatestMessagesFromDevices(
    syncMessagesFromGroupResponse: SyncMessagesFromGroupResponse[],
  ) {
    const latestDevicesMessages = syncMessagesFromGroupResponse.map((s) => {
      return <LatestDeviceMessage>{
        device: s.device,
        latestMessageTime: LatestDeviceMessage.convertToDate(
          s.highestMessageTime,
        ),
        latestMessageRegistrationTime: LatestDeviceMessage.convertToDate(
          s.highestMessageRegistrationTime,
        ),
      };
    });
    await this.createOrUpdateLatestDeviceMessages(latestDevicesMessages);
  }

  public async syncAllMessagesFromGroup(group: Group) {
    const groupDevicesMessages = await this.getAllMessagesFromGroup(group);
    const result = await Promise.all(
      groupDevicesMessages.devicesList.map(async (d, i) => {
        const device = await this.deviceService.getDeviceByDeviceID(d.id);
        const deviceMessages = groupDevicesMessages.messages[i].map((m) => {
          return {
            device: device.id,
            ...m,
          };
        });

        const saved = await this.createOrUpdateMessages(deviceMessages);

        return {
          device: device,
          highestMessageTime: Math.max(
            ...deviceMessages.map((a) => {
              return a.messageTime.getTime() / 1000;
            }),
          ),
          highestMessageRegistrationTime: Math.max(
            ...deviceMessages.map((a) => {
              return a.messageRegistrationTime.getTime() / 1000;
            }),
          ),
          newSynchronizedMessages: saved,
        };
      }),
    );

    await this.saveLatestMessagesFromDevices(result);

    return result;
  }
}
