import { types } from 'pg';
import moment from 'moment';

types.setTypeParser(20, function (val: string) {
  return parseInt(val, 10);
});

types.setTypeParser(1700, function (val: string) {
  return parseFloat(val);
});

// const parseFn = function (val: any) {
//   return val === null ? null : moment(val).format('YYYY-MM-DD HH:mm:ss');
// };
// types.setTypeParser(types.builtins.TIMESTAMPTZ, parseFn);
// types.setTypeParser(types.builtins.TIMESTAMP, parseFn);
