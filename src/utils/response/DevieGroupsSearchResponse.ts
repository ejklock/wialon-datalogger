import { Unit, UnitGroupsDataFormat } from 'node-wialon';

export interface DevieGroupsSearchResponse {
  searchSpec: unknown;
  dataFlags: number;
  totalItemsCount: number;
  indexFrom: number;
  indexTo: number;
  items: UnitGroupsDataFormat.GeneralProperties[];
}
