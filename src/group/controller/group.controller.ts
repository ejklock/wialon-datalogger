import { Controller, Get, Param } from '@nestjs/common';
import { Group } from '../entity/group.entity';
import { GroupService } from '../service/group/group.service';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  public async index(): Promise<Group[]> {
    const groups = await this.groupService.getAllSavedGroups();
    return groups;
  }

  @Get('/sync')
  public async syncGroups() {
    const result = await this.groupService.syncGroups();
    return result;
  }

  @Get('/sync/:id/messages')
  public async syncGroupMessages(@Param() groupID) {
    const result = await this.groupService.syncAllMessagesFromGroup(groupID);
    return result;
  }

  @Get('/syncAllGroupsDevices')
  public async syncDevicesFromGroups() {
    const devices = await this.groupService.syncDevicesFromGroups();

    return devices;
  }

  @Get('/syncAllGroupsDevicesMessages')
  public async syncAllDevicesMessagesFromAllGroups() {
    const devices = await this.groupService.syncAllDevicesMessagesFromAllGroups();

    return devices;
  }
}
