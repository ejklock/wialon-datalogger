import { GrouptaskService } from './../grouptask/grouptask.service';
import { MessageService } from 'src/message/service/message/message.service';
import { GroupService } from './../group/service/group/group.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private groupService: GroupService,
    private messageService: MessageService,
    private grouptaskService: GrouptaskService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async syncGroups() {
    this.logger.debug('Start groupsSync');
    await this.groupService.syncGroups();
    this.logger.debug('Start devices from groups Sync');
    await this.groupService.syncDevicesFromGroups();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async syncGroupsMessage() {
    const groupsMessagesToSync = await this.grouptaskService.getGroupsToSync();
    await Promise.all(
      groupsMessagesToSync.map(async (groupTask) => {
        this.logger.debug(
          `Start group message sync for: ${groupTask.group.name}`,
        );
        await this.messageService.syncAllMessagesFromGroup(groupTask.group);
      }),
    );
  }
}
