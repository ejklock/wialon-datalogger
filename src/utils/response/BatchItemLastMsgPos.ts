import { UnitsDataFormat } from 'node-wialon';

export interface BatchItemLastMsgPos {
  item: UnitsDataFormat.GeneralProperties & UnitsDataFormat.LastMessagePosition;
  flags: number;
}
