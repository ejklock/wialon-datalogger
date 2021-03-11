/**
 * https://sdk.wialon.com/wiki/en/sidebar/remoteapi/apiref/format/messages
 */

enum UnitMessagesFlags {
  MESSAGE_WITH_DATA = 0,
  SMS = 256,
  COMMAND = 512,
  EVENT = 1536,
}

enum ResourceMessagesFlags {
  NOTIFICATION = 768,
  BILLING_MESSAGE = 1280,
  SMS_FOR_DRIVER = 2304,
}

enum LogMessagesFlags {
  LOG = 4096,
}

enum MaskFlags {
  ALL_MESSAGES_WITH_DATA = 0,
  MESSAGES_WITH_DATA_WC_ALARMBIT = 65296,
  MESSAGES_WITH_DATA_WC_ALARMBIT_WITHOUT_DRIVER_CODE_INF0 = 65520,
}

export {
  UnitMessagesFlags,
  ResourceMessagesFlags,
  LogMessagesFlags,
  MaskFlags,
};
