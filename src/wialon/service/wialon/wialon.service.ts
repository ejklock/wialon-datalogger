import { Message } from './../../../message/entity/message.entity';
import { UnitDataTransformer } from './../../../utils/TOS/UnitDataTransformer';
import { UnitFlags } from './../../../utils/enums/UnitFlags';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Wialon, UnitGroupsDataFormat, UnitsDataFormat } from 'node-wialon';
import { Device } from 'src/device/entity/device.entity';
import { Params, Response } from 'node-wialon/dist/core/search_items';
import { Response as SearchItemResponse } from 'node-wialon/dist/core/search_item';
import { Parameters } from 'src/utils/interfaces/Parameters';
import { BatchItemLastMsgPos } from 'src/utils/response/BatchItemLastMsgPos';
import { Group } from 'src/group/entity/group.entity';
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

  public async getAllDeviceGroups() {
    await this.authenticate();
    const result = await this.wialonApi.execute<
      Params,
      Response<UnitGroupsDataFormat.GeneralProperties>
    >('core/search_items', {
      spec: {
        itemsType: 'avl_unit_group',
        propName: 'sys_name',
        propType: '',
        propValueMask: '*',
        sortType: 'sys_name',
      },
      force: 1,
      flags: UnitFlags.BASE_FLAG,
      from: 0,
      to: 0,
    });

    const deviceGroups = result.items?.map((item) => {
      return <Group>{
        name: item.nm,
        superClassID: item.cls,
        groupID: item.id,
        items: item.u.map((g) => {
          return <Parameters>{
            svc: 'core/search_item',
            params: {
              id: g,
              flags: UnitFlags.ADVANCED_PROPERTIES + UnitFlags.BASE_FLAG,
              flagsMask: 0,
            },
          };
        }),
      };
    });
    return deviceGroups;
  }

  protected async getBatchDevicesFromGroup(groups: Group[]) {
    const batch = await Promise.all(
      groups.map(async (group) => {
        try {
          const result = await this.wialonApi.execute<
            Parameters,
            SearchItemResponse<
              UnitsDataFormat.GeneralProperties &
                UnitsDataFormat.AdvancedProperties
            >[]
          >('core/batch', group.items);

          return {
            group,
            devices: result.map((i) => {
              return <Device>{
                deviceID: i.item.id,
                name: i.item.nm,
                superClassID: i.item.cls,
                active: i.item.act,
                currentUserAccessLevel: i.item.uacl,
                desactivationTime: i.item.dactt,
                deviceUuid: i.item.uid,
                deviceUuid2: i.item.uid2,
                hardwareType: i.item.hw,
                measureUnit: i.item.mu,
                phoneNumber: i.item.ph,
                phoneNumber2: i.item.ph2,
              };
            }),
          };
        } catch (error) {
          return null;
        }
      }),
    );
    return batch;
  }

  public async getBatchLastMessagesPositionFromDevices() {
    const devices = [{ id: 400281714 }, { id: 400285459 }, { id: 400286161 }];

    const batchParams = devices.map((dev) => {
      return {
        svc: 'core/search_item',
        params: {
          id: dev.id,
          flags: UnitFlags.BASE_FLAG + UnitFlags.LASTMESSAGE_AND_POSITION,
          flagsMask: 0,
        },
      };
    });

    const resp = await this.wialonApi.execute<unknown[], BatchItemLastMsgPos[]>(
      'core/batch',
      batchParams,
    );

    return resp;
  }

  public async getAllDevices2(flags = UnitFlags.ALL_POSSIBLE_FLAGS_TO_UNIT) {
    await this.authenticate();
    return await this.getAllDeviceGroups();

    // //const result = await this.wialonApi.Utils.getUnits({ flags });
    // const res = await this.wialonApi.execute('core/search_items', {
    //   spec: {
    //     itemsType: 'avl_unit',
    //     propName: 'rel_billing_account_name',
    //     propValueMask: '*ERPO*',
    //     sortType: 'sys_name',
    //   },
    //   force: 1,
    //   flags: 4096,
    //   from: 0,
    //   to: 0,
    // });

    // const test = await this.wialonApi.Core.batch({
    //   svc: 'messages/load_interval',
    //   params: [
    //     {
    //       itemId: 400281714,
    //       timeFrom: 0,
    //       timeTo: 0,
    //       flagsMask: 0,
    //       loadCount: 100,
    //     },
    //     {
    //       itemId: 400285459,
    //       timeFrom: 0,
    //       timeTo: 0,
    //       flagsMask: 0,
    //       loadCount: 100,
    //     },
    //     {
    //       itemId: 400286161,
    //       timeFrom: 0,
    //       timeTo: 0,
    //       flagsMask: 0,
    //       loadCount: 100,
    //     },
    //   ],
    //   flag: 0,
    // });
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
