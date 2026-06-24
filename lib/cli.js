import clipboard from 'clipboardy';
import { shuffle } from '../lib/shuffle.js';
import { punctuatedList } from '../lib/punctuatedList.js';
import { green, red, white, yellow } from '../lib/colors.js';
import {
  COPIED,
  NO_ARGUMENTS_MSG,
  NO_PARTICIPANTS_MSG,
  DEBUGGING_INFO,
} from './constants.js';
import { options } from './options.js';
import { formatObject } from './utils.js';
import { readConfiguration } from './configuration.js';
import { save } from './save.js';

const builder = {
  debug: {
    describe: 'Output debug information',
    type: 'boolean',
  },
  ...options,
  group: {
    alias: 'g',
    describe: 'Output participants in group',
    type: 'number',
  },
  save: {
    describe: 'Save the request to a config file',
    default: false,
    type: 'boolean',
  },
};

export function handler(argv) {
  if (!argv) {
    process.stderr.write(red(NO_ARGUMENTS_MSG) + '\n');
    return;
  }

  const { config = {} } = readConfiguration();

  if (argv.debug) {
    process.stdout.write(`${argv.clr ? yellow(DEBUGGING_INFO) : DEBUGGING_INFO}\n`);
    process.stdout.write(formatObject(argv, argv.clr, true));
  }

  let group;
  if (argv.group >= 0) {
    group = (config.groups || [])[+argv.group];
    if (!group) {
      process.stderr.write(`${argv.clr ? red(`Group ${argv.group} not found.\n`) : `Group ${argv.group} not found.\n`}`);
      return;
    }
  } else if (argv._.length === 0) {
    process.stderr.write(`${argv.clr ? red(NO_PARTICIPANTS_MSG) : NO_PARTICIPANTS_MSG}\n`);
    return;
  }

  const participants = group ? group.participants : argv._;
  const { clipboard: copyToClipboard, colors, oxfordComma, prefix, separators } = { ...argv, ...group };

  if (argv.save) {
    save({ clipboard: copyToClipboard, colors, oxfordComma, prefix, separators, _: participants });
  }

  const shuffled = shuffle(participants);
  const joined = punctuatedList(shuffled, {separator: separators[0], lastSeparator: separators[1] || separators[0], oxfordComma});
  const needsSpace = prefix && !/\s$/.test(prefix);
  const result = `${prefix}${needsSpace ? ' ' : ''}${joined}`;
    
  let copied = '';
  if (copyToClipboard) {
    clipboard.writeSync(result);
    copied = colors ? green(COPIED) : COPIED;
  }
    
  process.stdout.write(`${copied}${colors ? white(result) : result}\n`);
}

export default {
  builder,
  handler,
};
