import { DeviceService } from './../service/device/device.service';
import { Device } from 'src/device/entity/device.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/entity/message.entity';

@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  @Get()
  public async index(): Promise<Device[]> {
    const devices = await this.deviceRepository.find();
    return devices;
  }

  @Get(':id/messages')
  public async messages(@Param() deviceID) {
    const deviceMessages = await this.messageRepository.find({
      where: { device: deviceID },
      order: { messageTime: 'DESC' },
    });
    return deviceMessages;
  }
  @Get('sync')
  public async syncDevices(): Promise<Device[]> {
    const devices = await this.deviceService.getAllDevices();
    const saved = await this.deviceRepository.save(devices);
    return saved;
  }

  @Get(':id/syncMessages')
  public async syncDeviceMessages(@Param() deviceID): Promise<Message[]> {
    const device = await this.deviceRepository.findOne(deviceID);

    const messages = await this.deviceService.getDeviceMessages(
      device.deviceID,
      device.id,
    );
    const saved = await this.messageRepository.save(messages);
    return saved;
  }
}
