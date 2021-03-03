import { UnitDataResponse } from './../response/UnitDataResponse';

import { Device } from 'src/device/entity/device.entity';
export class UnitDataTransformer {
  public static toDeviceFromItem(item: UnitDataResponse): Device {
    const device = new Device();

    device.name = item.nm;
    device.active = item.act;
    device.currentUserAccessLevel = item.uacl;
    device.desactivationTime = item.dactt;
    device.deviceID = item.id;
    device.deviceUuid = item.uid;
    device.deviceUuid2 = item.uid2;
    device.hardwareType = item.hw;
    device.measureUnit = item.mu;
    device.phoneNumber2 = item.ph2;
    device.phoneNumber = item.ph;
    device.superClassID = item.cls;

    return device;
  }
  public static toDeviceFromItems(items): Array<Device> {
    const unitDataResponses = items as UnitDataResponse[];
    const devices = Array<Device>();
    unitDataResponses.map((item) => {
      const device = new Device();
      device.name = item.nm;
      device.active = item.act;
      device.currentUserAccessLevel = item.uacl;
      device.desactivationTime = item.dactt;
      device.deviceID = item.id;
      device.deviceUuid = item.uid;
      device.deviceUuid2 = item.uid2;
      device.hardwareType = item.hw;
      device.measureUnit = item.mu;
      device.phoneNumber2 = item.ph2;
      device.phoneNumber = item.ph;
      device.superClassID = item.cls;
      devices.push(device);
    });
    return devices;
  }
}
