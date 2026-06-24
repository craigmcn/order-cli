import { COLORS, color } from './colors.js';
import { readConfiguration } from './configuration.js';
import { formatObject } from './utils.js';

const command = 'show';
const aliases = ['config'];
const describe = 'Display configuration values';
const builder = {
  group: {
    alias: 'g',
    describe: 'The zero-based index of the group to display (default: -1)',
    type: 'number',
  },
};

export function handler(argv) {
  const { config = {} } = readConfiguration();

  const configData = argv.group >= 0 ? (config.groups || [])[+argv.group] : config;

  if (argv.group >= 0 && !configData) {
    process.stderr.write(color(`Group ${argv.group} not found.\n`, COLORS.YELLOW));
    return;
  }

  const configKeys = Object.keys(configData);
  const sortedConfig = configKeys.sort()
    .reduce(function (acc, key) {
      acc[key] = configData[key];
      return acc;
    }, {});
  const displayColors = configData.colors ?? config.colors;

  if (configKeys.length) {
    process.stdout.write(color('Configuration\n', COLORS.BLUE, displayColors));

    if (argv.group >= 0) {
      process.stdout.write(color('Group: ', COLORS.BLUE, displayColors));
      process.stdout.write(color(`${argv.group}\n`, COLORS.WHITE, displayColors));
    }

    process.stdout.write(formatObject(sortedConfig, displayColors) + '\n');
  } else {
    process.stderr.write(color('No configuration found.\n', COLORS.YELLOW));
  }
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
