import { CreateGroupTaskDTO } from './dtos/CreateGroupTaskDTO';
import { GrouptaskService } from './grouptask.service';
import { Grouptask } from './entity/grouptask.entity';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('grouptask')
export class GrouptaskController {
  constructor(private grouptaskService: GrouptaskService) {}
  @Get()
  public async index(): Promise<Grouptask[]> {
    return await this.grouptaskService.getAll();
  }

  @Post('')
  public async store(@Body() createGroupTaskDTO: CreateGroupTaskDTO) {
    const { groupID, status = false } = createGroupTaskDTO;
    const created = await this.grouptaskService.store(groupID, status);

    return created;
  }
}
