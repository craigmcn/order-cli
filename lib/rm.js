import { green, white, yellow } from './colors.js';
import { CONFIG_UPDATE_MSG } from './constants.js';
import { validKeys } from './options.js';
import { configurationFile, readConfiguration, writeConfiguration } from './configuration.js';

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

  const key = argv.key === 'groups' ? 'groups' : validKeys[argv.key].parent;

  if (!configFile.exists) {
    process.stderr.write(yellow('No configuration file found.\n'));
    return;
  }

  const { config } = readConfiguration();

  const configData = argv.group >= 0 ? config.groups[+argv.group] : config;

  if (argv.group >= 0 && !configData) {
    process.stderr.write(yellow(`Group ${argv.group} not found.\n`));
    return;
  }

  if (argv.index >= 0 && Array.isArray(configData[key])) {
    if (argv.index >= configData[key].length) {
      process.stderr.write(yellow(`Index ${argv.index} does not exist.\n`));
      return;
    }

    configData[key].splice(argv.index, 1);
    message = `Removed ${key}[${argv.index}]`;
  } else {
    if (argv.key === 'groups' && !argv.index) {
      process.stderr.write(yellow('Index is required to remove a group.\n'));
      return;
    }

    delete configData[key];
    message = `Removed ${key}`;
  }

  writeConfiguration(config,configFile.format);

  process.stdout.write(config.colors ? green(CONFIG_UPDATE_MSG) : CONFIG_UPDATE_MSG);
  process.stdout.write(config.colors ? white(message) : message);
  process.stdout.write('\n');
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
