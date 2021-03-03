import { UnitsDataFormat } from 'node-wialon';
export interface UnitDataResponse
  extends UnitsDataFormat.GeneralProperties,
    UnitsDataFormat.AdvancedProperties {}
