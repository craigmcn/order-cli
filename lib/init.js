import path from 'path';
import { CONFIG_FILE_FORMATS, DEFAULT_CONFIG } from './constants.js';
import { blue, red, white, yellow } from './colors.js';
import { configurationFile, writeConfiguration } from './configuration.js';

const command = 'initialize';
const aliases = ['i', 'init'];
const describe = 'Initialize the options and create a config file';
const builder = {
  format: {
    alias: 'f',
    describe: `The format of the config file (\`${CONFIG_FILE_FORMATS.join('`, `')}\`)`,
    default: CONFIG_FILE_FORMATS[0],
    type: 'string',
  },
};

export function handler(argv) {
  const configFile = configurationFile();
  const format = argv.format.toLowerCase();

  if (CONFIG_FILE_FORMATS.indexOf(format) === -1) {
    process.stderr.write(red('Invalid format: '));
    process.stderr.write(`${white(argv.format)}\n`);
    process.stderr.write(blue('Allowed formats: '));
    process.stderr.write(`${white(CONFIG_FILE_FORMATS.join(', '))}\n`);
    return;
  }

  if (configFile.exists) {
    process.stderr.write(yellow('Configuration file already exists: '));
    process.stderr.write(`${white(`${configFile.file}`)}\n`);
    process.stderr.write(`${white(`Edit ${configFile.name} or use 'set' to update configuration settings.`)}\n`);
    return;
  }

  writeConfiguration({ ...DEFAULT_CONFIG }, format);

  const configPath = path.join(configFile.path, `${configFile.name}.${format}`);
  process.stdout.write(blue('Created config file: '));
  process.stdout.write(`${white(configPath)}\n`);
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
