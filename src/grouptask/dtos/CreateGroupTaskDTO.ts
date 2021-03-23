import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateGroupTaskDTO {
  @IsNotEmpty()
  groupID: string;

  @IsBoolean()
  status: boolean;
}
