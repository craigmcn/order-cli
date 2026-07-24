import { validKeys } from './options.js';
import { CONFIG_UPDATE_MSG, DEFAULT_CONFIG } from './constants.js';
import { COLORS, color } from './colors.js';
import { configurationFile, readConfiguration, resolveGroup, writeConfiguration } from './configuration.js';

const command = 'set <key> [value..]';
const aliases = ['define', 'def'];
const describe = 'Set configuration value. Use -g or --group to set a key on a specific saved group.';
const builder = {
  group: {
    alias: 'g',
    describe: 'The zero-based index of the group to update (default: -1)',
    type: 'number',
  },
  key: {
    choices: Object.keys(validKeys),
    describe: 'Configuration key',
  },
  value: {
    default: true,
    describe: 'Configuration value',
  },
};

export function handler(argv) {
  const configFile = configurationFile();

  const noValueGiven = argv.value.length === 1 && argv.value[0] === true;
  if (noValueGiven && validKeys[argv.key].type !== 'boolean') {
    process.stderr.write(color(`A value is required for '${argv.key}'.\n`, COLORS.RED, argv.colors));
    return;
  }

  if (['string', 'boolean'].includes(validKeys[argv.key].type)) {
    argv.value = argv.value[0];

    if (validKeys[argv.key].type === 'boolean' && ['true', 'false'].includes(argv.value)) {
      argv.value = argv.value === 'true';
    }
  }

  if (argv.group >= 0) {
    if (!configFile.exists) {
      process.stderr.write(color('No configuration file found.\n', COLORS.YELLOW, argv.colors));
      return;
    }

    const { config } = readConfiguration();
    const group = resolveGroup(config, +argv.group);

    if (!group) {
      process.stderr.write(color(`Group ${argv.group} not found.\n`, COLORS.YELLOW, config.colors));
      return;
    }

    group[validKeys[argv.key].parent] = argv.value;
    writeConfiguration(config, configFile.format);
    writeUpdateMessage(argv, config.colors);
    return;
  }

  const config = configFile.exists
    ? { ...readConfiguration().config, [validKeys[argv.key].parent]: argv.value }
    : { ...DEFAULT_CONFIG, [validKeys[argv.key].parent]: argv.value };

  writeConfiguration(config, configFile.exists ? configFile.format : 'json');
  writeUpdateMessage(argv, config.colors);
}

function writeUpdateMessage(argv, colors) {
  let value = argv.value;
  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  process.stdout.write(color(CONFIG_UPDATE_MSG, COLORS.GREEN, colors));
  process.stdout.write(color(`${argv.key} = ${value}`, COLORS.WHITE, colors));
  process.stdout.write('\n');
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
