import { Controller, Get } from '@nestjs/common';
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

  @Get('/syncAllGroupsDevices')
  public async syncDevicesFromGroups() {
    const groups = await this.groupService.getAllSavedGroups();

    const devices = await this.groupService.syncDevicesFromGroups(groups);

    return devices;
  }
}
