import { CacheModule, Module } from '@nestjs/common';
import { WialonService } from './service/wialon/wialon.service';

@Module({
  imports: [CacheModule.register()],
  providers: [WialonService],
})
export class WialonModule {}
