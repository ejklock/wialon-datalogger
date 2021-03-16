import { MessageService } from './service/message/message.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],

  controllers: [],
  providers: [MessageService],
})
export class MessageModule {}
