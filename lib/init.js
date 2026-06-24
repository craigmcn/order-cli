import path from 'path';
import { CONFIG_FILE_FORMATS, DEFAULT_CONFIG } from './constants.js';
import { COLORS, color } from './colors.js';
import { options } from './options.js';
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
  colors: options.colors,
};

export function handler(argv) {
  const configFile = configurationFile();
  const format = argv.format.toLowerCase();

  if (CONFIG_FILE_FORMATS.indexOf(format) === -1) {
    process.stderr.write(color('Invalid format: ', COLORS.RED, argv.colors));
    process.stderr.write(`${color(argv.format, COLORS.WHITE, argv.colors)}\n`);
    process.stderr.write(color('Allowed formats: ', COLORS.BLUE, argv.colors));
    process.stderr.write(`${color(CONFIG_FILE_FORMATS.join(', '), COLORS.WHITE, argv.colors)}\n`);
    return;
  }

  if (configFile.exists) {
    process.stderr.write(color('Configuration file already exists: ', COLORS.YELLOW, argv.colors));
    process.stderr.write(`${color(`${configFile.file}`, COLORS.WHITE, argv.colors)}\n`);
    process.stderr.write(`${color(`Edit ${configFile.name} or use 'set' to update configuration settings.`, COLORS.WHITE, argv.colors)}\n`);
    return;
  }

  writeConfiguration({ ...DEFAULT_CONFIG }, format);

  const configPath = path.join(configFile.path, `${configFile.name}.${format}`);
  process.stdout.write(color('Created config file: ', COLORS.BLUE, argv.colors));
  process.stdout.write(`${color(configPath, COLORS.WHITE, argv.colors)}\n`);
}

export default {
  command,
  aliases,
  describe,
  builder,
  handler,
};
