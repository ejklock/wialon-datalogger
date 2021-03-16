import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
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

    const { generatedMaps } = result;

    return generatedMaps;
  }
}
