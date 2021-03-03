import { Injectable } from '@nestjs/common';
import { Wialon, UnitsDataFormat } from 'node-wialon';

@Injectable()
export class AppService {
  async getHello() {
    const wialon = await Wialon.tokenLogin({
      token:
        'a28171c5859bb32b14c99765af83c3170D13F1495EA1D034FB09561C8018C1F6FE572334',
    });

    const test = await wialon.Messages.loadInterval({
      itemId: 400281714,
      flagsMask: 0,
      flags: 1,
      timeFrom: 1577836800,
      timeTo: 1614291300,
      loadCount: 100,
    });
    return test;
  }
}
