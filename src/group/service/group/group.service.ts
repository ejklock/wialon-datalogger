import { WialonService } from './../../../wialon/service/wialon/wialon.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Group } from 'src/group/entity/group.entity';
import { Repository } from 'typeorm';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { DeviceService } from 'src/device/service/device/device.service';
import { MessageService } from 'src/message/service/message/message.service';

@Injectable()
export class GroupService {
  protected saveds = [];
  constructor(
    private wialonService: WialonService,
    private deviceService: DeviceService,
    private messageService: MessageService,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  public async getAllSavedGroups() {
    const groups = await this.groupRepository.find();
    return groups;
  }

  public async syncGroups() {
    const deviceGroups = await this.wialonService.getAllDeviceGroups();
    const upSaved = await TypeOrmUpsert(
      this.groupRepository,
      deviceGroups,
      'groupID',
      { doNotUpsert: ['id', 'groupdID'] },
    );
    return upSaved;
  }

  public async syncAllMessagesFromGroup(groupID) {
    const group = await this.groupRepository.findOne(groupID);
    const groupDevicesMessages = await this.wialonService.getMessagesFromGroup(
      group,
    );

    const result = Promise.all(
      groupDevicesMessages.devicesList.map(async (d, i) => {
        const device = await this.deviceService.getDeviceByDeviceID(d.id);
        const deviceMessages = groupDevicesMessages.messages[i].map((m) => {
          return {
            device: device.id,
            ...m,
          };
        });

        const saved = await this.messageService.createOrUpdateMessages(
          deviceMessages,
        );
        return {
          device: device,
          createdOrUpdatedMessages: saved.length,
        };
      }),
    );

    return result;
  }

  public async syncAllDevicesMessagesFromAllGroups() {
    // const groups = await this.getAllSavedGroups();
    // const result = await this.wialonService.getAllMessagesFromGroups(groups);
    // // result.map((gd)=>{
    // //   gd.devicesList.forEach((d,i)=>{
    // //     gd.messages[i]=
    // //   })
    // // })

    return await this.syncAllMessagesFromGroup('asas');
  }

  public async syncDevicesFromGroups() {
    const groups = await this.groupRepository.find();
    const groupsDevices = await this.wialonService.getBatchDevicesFromGroups(
      groups,
    );
    const result = Promise.all(
      groupsDevices.map(async (groupDevice) => {
        if (groupDevice.devices.length !== 0) {
          const savedDevices = await this.deviceService.createOrUpdateDevices(
            groupDevice.devices,
          );
          groupDevice.group.devices = savedDevices;
          const saved = await this.groupRepository.save(groupDevice.group);
          return {
            saved,
          };
        }
      }),
    );

    return result;
  }
}
