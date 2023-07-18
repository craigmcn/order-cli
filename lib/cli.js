import clipboard from 'clipboardy';
import { shuffle } from '../lib/shuffle.js';
import { joinAnd } from '../lib/joinAnd.js';
import { green, red, white, yellow } from '../lib/colors.js';
import {
  COPIED,
  NO_ARGUMENTS_MSG,
  NO_PARTICIPANTS_MSG,
  MAX_PARTICIPANTS,
  MAX_PARTICIPANTS_MSG,
  DEBUGGING_INFO,
} from './constants.js';

export function cli(argv) {
  const message = [];
  let error = '';

  if (!argv) {
    return {
      message: '',
      error: NO_ARGUMENTS_MSG,
    };
  }

  if (argv._.length === 0) {
    error = argv.clr ? red(NO_PARTICIPANTS_MSG) : NO_PARTICIPANTS_MSG;
  }

  if (argv._.length > MAX_PARTICIPANTS) {
    error = argv.clr ? red(MAX_PARTICIPANTS_MSG) : MAX_PARTICIPANTS_MSG;
  }

  if (argv.debug) {
    message.push(argv.clr ? yellow(DEBUGGING_INFO) : DEBUGGING_INFO);
    message.push(JSON.stringify(argv, null, 2));
  }

  if (!error) {
    const shuffled = shuffle(argv._);
    const joined = joinAnd(shuffled, {separator: argv.s[0], lastSeparator: argv.s[1], oxfordComma: argv.oc});
    const result = argv.p + joined;
    
    let copied = '';
    if (argv.cc) {
      clipboard.writeSync(result);
      copied = argv.clr ? green(COPIED) : COPIED;
    }
    
    message.push(`${copied}${argv.clr ? white(result) : result}`);
  }

  return {
    message: message.join('\n'),
    error,
  };
}
