/**
 * https://sdk.wialon.com/wiki/en/local/remoteapi1804/apiref/format/unit?s[]=flags
 */

export enum UnitFlags {
  BASE_FLAG = 1,
  CUSTOM_PROPERTIES = 2,
  BILLING_PROPERTIES = 4,
  CUSTOM_FIELDS = 8,
  IMAGE = 16,
  MESSAGES = 32,
  GUID = 64,
  ADMINISTRATIVE_FIELDS = 128,
  ADVANCED_PROPERTIES = 256,
  ALL_FOR_CURRENT_MOMENT_COMMANDS = 512,
  LASTMESSAGE_AND_POSITION = 1024,
  SENSORS = 4096,
  COUNTERS = 8192,
  MAINTENANCE = 32768,
  TRIP_DETECTOR_AND_FUEL_CONSUMP = 131072,
  ALL_POSSIBLE_COMMANDS_FOR_CURRENT_UNIT = 524288,
  MESSAGE_PARAMETERS = 1048576,
  UNIT_CONNECTION_STATUS = 2097152,
  POSITION = 4194304,
  PROFILE_FIELDS = 8388608,
  ALL_POSSIBLE_FLAGS_TO_UNIT = 4611686018427387903,
}
