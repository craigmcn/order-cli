export const CONFIG_FILE_FORMATS = ['json', 'yaml'];
export const CONFIG_FILE_NAME = '.orderrc';
export const CONFIG_UPDATE_MSG = 'Configuration updated: ';
export const COPIED = 'Copied to clipboard: ';
export const DEBUGGING_INFO = 'Debugging information:';
export const NO_ARGUMENTS_MSG = 'No arguments provided';
export const NO_PARTICIPANTS_MSG = 'No participants provided';
export const PREFIX = 'Speaking order: ';
export const SEPARATORS = [',', 'then'];

export const DEFAULT_ARGV = {
  _: [],
  cc: true,
  clipboard: true,
  clr: true,
  colors: true,
  debug: false,
  oc: false,
  oxfordComma: false,
  p: PREFIX,
  prefix: PREFIX,
  s: SEPARATORS,
  separators: SEPARATORS,
};

export const DEFAULT_CONFIG = {
  clipboard: DEFAULT_ARGV.cc,
  colors: DEFAULT_ARGV.clr,
  oxfordComma: DEFAULT_ARGV.oc,
  prefix: PREFIX,
  separators: DEFAULT_ARGV.s,
  groups: [],
};
