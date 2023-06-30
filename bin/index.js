#! /usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import clipboard from 'clipboardy'
import { shuffle } from '../lib/shuffle.js';
import { joinAnd } from '../lib/joinAnd.js';
import { green, red, white } from '../lib/colors.js';

const y = yargs()
y.usage('Usage:  $0 [options] [--] <participants...>')
y.usage('')
y.usage(`Examples:`)
y.usage(`$0 ${green('Alice Bob Charlie')}`)
y.usage(`> ${white('Speaking order: Bob, Charlie then Alice')}`)
y.usage(`$0 -p "Here's the order: " ${green('Alice Bob Charlie')}`)
y.usage(`> ${white('Here\'s the order: Charlie, Bob then Alice')}`)
y.usage(`$0 -s ";" "and" --oc -- ${green('Alice Bob Charlie')}`)
y.usage(`> ${white('Speaking order: Alice; Charlie; and Bob')}`)

y.alias('h', 'help')
y.alias('v', 'version')
y.option('debug', {
  describe: 'Output debug information',
  type: 'boolean'
})

y.option('p', {
  alias: 'prefix',
  describe: 'Output prefix',
  default: 'Speaking order: ',
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
  describe: 'Use the Oxford comma (e.g., "Alice, Bob, and Charlie"; applies the last separator to the second-to-last item)',
  type: 'boolean'
})
y.option('cc', {
  alias: 'clipboard',
  describe: 'Copy the output to the clipboard (to disable: --no-cc, --no-clipboard))',
  default: true,
  type: 'boolean'
})

const argv = y.parse(hideBin(process.argv))
if (argv.debug) console.log(argv)

if (argv._.length === 0) {
  console.error(red('No participants provided'))
  process.exit(1)
}

if (argv._.length > 16) {
  // This is just a random number I picked
  console.error(red('Maximum participants (16) exceeded'))
  process.exit(1)
}

const shuffled = shuffle(argv._)
const joined = joinAnd(shuffled, {separator: argv.s[0], lastSeparator: argv.s[1], oxfordComma: argv.oc})
const result = argv.p + joined

let copied = ''
if (argv.cc) {
  clipboard.writeSync(result);
  copied = green('Copied to clipboard: ')
}

console.log(`${copied}${white(`${result}`)}`)
