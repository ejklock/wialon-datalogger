import { Test, TestingModule } from '@nestjs/testing';
import { GrouptaskService } from './grouptask.service';

describe('GrouptaskService', () => {
  let service: GrouptaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrouptaskService],
    }).compile();

    service = module.get<GrouptaskService>(GrouptaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
