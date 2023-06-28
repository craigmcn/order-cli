#! /usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import clipboard from 'clipboardy'
import chalk from 'chalk';
import { shuffle } from '../lib/shuffle.js';
import { joinAnd } from '../lib/joinAnd.js';

const y = yargs()
y.usage('Usage:  $0 [options] [--] <participants...>')
y.usage('')
y.usage(`Examples:`)
y.usage(`$0 ${chalk.greenBright('Alice Bob Charlie')}`)
y.usage(`> ${chalk.white('Speaking order: Bob, Charlie then Alice')}`)
y.usage(`$0 -p "Here's the order: " ${chalk.greenBright('Alice Bob Charlie')}`)
y.usage(`> ${chalk.white('Here\'s the order: Charlie, Bob then Alice')}`)
y.usage(`$0 -s ";" "and" --oc -- ${chalk.greenBright('Alice Bob Charlie')}`)
y.usage(`> ${chalk.white('Speaking order: Alice; Charlie; and Bob')}`)

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

const argv = y.parse(hideBin(process.argv))
if (argv.debug) console.log(argv)

if (argv._.length === 0) {
  console.error(chalk.redBright('No participants provided'))
  process.exit(1)
}

if (argv._.length > 16) {
  // This is just a random number I picked
  console.error(chalk.redBright('Maximum participants (16) exceeded'))
  process.exit(1)
}

const result = joinAnd(shuffle(argv._), {separator: argv.s[0], lastSeparator: argv.s[1], oxfordComma: argv.oc})
const toClipboard = argv.p + result
clipboard.writeSync(toClipboard);

console.log(`${chalk.greenBright('Copied to clipboard:')} ${chalk.white(`${toClipboard}`)}`)
