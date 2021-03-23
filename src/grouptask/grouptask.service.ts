import { GroupService } from './../group/service/group/group.service';
import { Repository } from 'typeorm';
import { Grouptask } from './entity/grouptask.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GrouptaskService {
  constructor(
    @InjectRepository(Grouptask)
    private groupTaskRepository: Repository<Grouptask>,
    private groupService: GroupService,
  ) {}

  public async getAll() {
    return await this.groupTaskRepository.find();
  }

  public async store(groupId: string, status: boolean) {
    const group = await this.groupService.getGroupById(groupId);
    const groupTask = new Grouptask();
    groupTask.group = group;
    groupTask.status = status;

    return await this.groupTaskRepository.save(groupTask);
  }

  public async getGroupsToSync() {
    const groupsToSync = await this.groupTaskRepository.find({
      where: { status: true },
    });

    return groupsToSync;
  }
}
