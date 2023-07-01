#! /usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import clipboard from 'clipboardy'
import { shuffle } from '../lib/shuffle.js';
import { joinAnd } from '../lib/joinAnd.js';
import { green, red, white, yellow } from '../lib/colors.js';

const PREFIX = 'Speaking order: ';
const COPIED = 'Copied to clipboard: ';
const NO_PARTICIPANTS_MSG = 'No participants provided';
const MAX_PARTICIPANTS = 16; // This is just a random number I picked
const MAX_PARTICIPANTS_MSG = `Maximum participants (${MAX_PARTICIPANTS}) exceeded`;
const DEBUGGING_INFO = 'Debugging info:';

const y = yargs()
y.usage('Usage:  $0 [options] [--] <participants...>')
y.usage('')
y.usage(`Examples:`)
y.usage(`$0 ${green('Alice Bob Charlie')}`)
y.usage(`> ${white(`${PREFIX}Bob, Charlie then Alice`)}`)
y.usage(`$0 -p "Here's the order: " ${green('Alice Bob Charlie')}`)
y.usage(`> ${white('Here\'s the order: Charlie, Bob then Alice')}`)
y.usage(`$0 -s ";" "and" --oc -- ${green('Alice Bob Charlie')}`)
y.usage(`> ${white(`${PREFIX}Alice; Charlie; and Bob`)}`)

y.alias('h', 'help')
y.alias('v', 'version')
y.option('debug', {
  describe: 'Output debug information',
  type: 'boolean'
})

y.option('p', {
  alias: 'prefix',
  describe: 'Output prefix',
  default: PREFIX,
  type: 'string'
})
y.option('s', {
  alias: 'separators',
  describe: 'Output list separators (i.e., [separator, lastSeparator])',
  default: [',', 'then'],
  type: 'array'
})
y.option('oc', {
  alias: 'oxford-comma',
  describe: 'Use the Oxford comma (e.g., "Alice, Bob, and Charlie"; applies the separator to the second-to-last item)',
  type: 'boolean'
})
y.option('cc', {
  alias: 'clipboard',
  describe: 'Copy the output to the clipboard (to disable: --no-cc, --no-clipboard))',
  default: true,
  type: 'boolean'
})
y.option('clr', {
  alias: 'colors',
  describe: 'Colorize the output (to disable: --no-clr, --no-colors)',
  default: true,
  type: 'boolean'
})

const argv = y.parse(hideBin(process.argv))
if (argv.debug) {
  console.log(argv.clr ? yellow(DEBUGGING_INFO) : DEBUGGING_INFO)
  console.log(argv)
}

let error;
if (argv._.length === 0) {
  error = argv.clr ? red(NO_PARTICIPANTS_MSG) : NO_PARTICIPANTS_MSG
}

if (argv._.length > MAX_PARTICIPANTS) {
  error = argv.clr ? red(MAX_PARTICIPANTS_MSG) : MAX_PARTICIPANTS_MSG
}

if (error) {
  console.error(error)
  process.exit(1)
}

const shuffled = shuffle(argv._)
const joined = joinAnd(shuffled, {separator: argv.s[0], lastSeparator: argv.s[1], oxfordComma: argv.oc})
const result = argv.p + joined

let copied = ''
if (argv.cc) {
  clipboard.writeSync(result);
  copied = argv.clr ? green(COPIED) : COPIED
}

const output = argv.clr ? white(result) : result
console.log(`${copied}${output}`)
