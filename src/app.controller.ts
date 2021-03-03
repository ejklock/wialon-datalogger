import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { Wialon, Messages } from 'node-wialon';
import { DeviceService } from './device/service/device/device.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly deviceService: DeviceService,
  ) {}

  @Get()
  async getHello() {
    return await this.deviceService.getAllDevices2();
  }
}
