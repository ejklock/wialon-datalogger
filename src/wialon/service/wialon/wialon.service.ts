import { Message } from './../../../message/entity/message.entity';
import { UnitDataTransformer } from './../../../utils/TOS/UnitDataTransformer';
import { UnitFlags } from './../../../utils/enums/UnitFlags';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Wialon } from 'node-wialon';
import { Device } from 'src/device/entity/device.entity';
@Injectable()
export class WialonService {
  public wialonApi: Wialon;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  protected async setSessionIdOnCache(sessionId) {
    await this.cacheManager.set('eid', sessionId, { ttl: 120 });
  }

  protected async getSessionIdOnCache(): Promise<string> {
    try {
      const sessionId = await this.cacheManager.get<string>('eid');
      return sessionId;
    } catch (error) {
      return null;
    }
  }

  protected getCurrentDate() {
    return Math.floor(new Date().getTime() / 1000);
  }

  protected convertToDate(unixTime: number) {
    return new Date(unixTime * 1000);
  }
  protected async authenticate() {
    const eid = await this.getSessionIdOnCache();
    if (eid) {
      this.wialonApi = Wialon.useSession(eid);
    } else {
      this.wialonApi = await Wialon.tokenLogin({
        token: process.env.WIALON_PROD_TOKEN,
      });
      await this.setSessionIdOnCache(this.wialonApi.sessionId);
    }
  }

  protected convertToUnixTime(time = new Date()) {
    return Math.floor(time.getTime() / 1000);
  }

  public async getAllDevices2(flags = UnitFlags.ALL_POSSIBLE_FLAGS_TO_UNIT) {
    await this.authenticate();
    //const result = await this.wialonApi.Utils.getUnits({ flags });
    const res = await this.wialonApi.execute('core/search_items', {
      spec: {
        itemsType: 'avl_unit',
        propName: 'rel_billing_account_name',
        propValueMask: '*ERPO*',
        sortType: 'sys_name',
      },
      force: 1,
      flags: 4096,
      from: 0,
      to: 0,
    });
    //const { items } = result;
    //const devices = UnitDataTransformer.toDeviceFromItems(items);
    return res;
  }

  public async getAllDevices(
    flags = UnitFlags.ADVANCED_PROPERTIES + UnitFlags.BASE_FLAG,
  ): Promise<Device[]> {
    await this.authenticate();
    const { items } = await this.wialonApi.Utils.getUnits({ flags });

    const devices = UnitDataTransformer.toDeviceFromItems(items);
    return devices;
  }

  public async getMessagesFromDevice(
    id = null,
    deviceid,
    timeFrom,
    timeTo,
    flagsMask = 0,
    flags = 1,
    loadCount = 300,
  ) {
    await this.authenticate();

    const result = await this.wialonApi.Messages.loadInterval({
      itemId: deviceid,
      flagsMask: flagsMask,
      flags: flags,
      timeFrom: timeFrom,
      timeTo: timeTo,
      loadCount: loadCount,
    });

    console.log(result);
    const { messages } = result;

    const mapped = messages.map((m) => {
      return <Message>{
        ...(id && { device: id }),
        messageType: m.tp,
        messageTime: this.convertToDate(m.t),
        lat: m.pos.x,
        lng: m.pos.y,
        alt: m.pos.z,
        parameters: m.p,
        inputData: m.i,
        outPutData: m.o,
        lbsMessageCheckSum: m.lc,
        messageRegistrationTime: this.convertToDate(m.rt),
      };
    });

    return mapped;
  }
}
