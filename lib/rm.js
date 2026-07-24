import { COLORS, color } from './colors.js';
import { CONFIG_UPDATE_MSG } from './constants.js';
import { validKeys } from './options.js';
import { configurationFile, readConfiguration, resolveGroup, writeConfiguration } from './configuration.js';

const command = 'rm <key> [index]';
const aliases = ['remove'];
const describe = 'Remove configuration value. Use index to remove a group. Use -g or --group to remove a key from a group.';
const builder = {
  group: {
    alias: 'g',
    describe: 'The zero-based index of the group to access (default: -1)',
    type: 'number',
  },
  key: {
    choices: [...Object.keys(validKeys), 'groups'],
    describe: 'Configuration key',
  },
  index: {
    describe: 'Configuration index',
    type: 'number',
  },
};

export function handler(argv) {
  const configFile = configurationFile();
  let message = '';

  if (!configFile.exists) {
    process.stderr.write(color('No configuration file found.\n', COLORS.YELLOW, argv.colors));
    return;
  }

  const { config } = readConfiguration();

  const configData = argv.group >= 0 ? resolveGroup(config, +argv.group) : config;

  if (argv.group >= 0 && !configData) {
    process.stderr.write(color(`Group ${argv.group} not found.\n`, COLORS.YELLOW, config.colors));
    return;
  }

  if (argv.key === 'groups') {
    if (argv.index == null) {
      process.stderr.write(color('Index is required to remove a group.\n', COLORS.YELLOW, config.colors));
      return;
    }

    if (!Array.isArray(configData.groups)) {
      process.stderr.write(color('No groups configured.\n', COLORS.YELLOW, config.colors));
      return;
    }

    if (argv.index >= configData.groups.length) {
      process.stderr.write(color(`Index ${argv.index} does not exist.\n`, COLORS.YELLOW, config.colors));
      return;
    }

    configData.groups.splice(argv.index, 1);
    message = `Removed groups[${argv.index}]`;
  } else {
    const key = validKeys[argv.key].parent;

    if (argv.index >= 0 && Array.isArray(configData[key])) {
      if (argv.index >= configData[key].length) {
        process.stderr.write(color(`Index ${argv.index} does not exist.\n`, COLORS.YELLOW, config.colors));
        return;
      }

      configData[key].splice(argv.index, 1);
      message = `Removed ${key}[${argv.index}]`;
    } else {
      delete configData[key];
      message = `Removed ${key}`;
    }
  }

  writeConfiguration(config,configFile.format);

  process.stdout.write(color(CONFIG_UPDATE_MSG, COLORS.GREEN, config.colors));
  process.stdout.write(color(message, COLORS.WHITE, config.colors));
  process.stdout.write('\n');
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
