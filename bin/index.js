#! /usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { cli } from '../lib/cli.js';
import { green, white } from '../lib/colors.js';
import { PREFIX } from '../lib/constants.js';

const y = yargs();
y.usage('Usage:  $0 [options] [--] <participants...>');
y.usage('');
y.usage('Examples:');
y.usage(`$0 ${green('Alice Bob Charlie')}`);
y.usage(`> ${white(`${PREFIX}Bob, Charlie then Alice`)}`);
y.usage(`$0 -p "Here's the order: " ${green('Alice Bob Charlie')}`);
y.usage(`> ${white('Here\'s the order: Charlie, Bob then Alice')}`);
y.usage(`$0 -s ";" "and" --oc -- ${green('Alice Bob Charlie')}`);
y.usage(`> ${white(`${PREFIX}Alice; Charlie; and Bob`)}`);

y.alias('h', 'help');
y.alias('v', 'version');
y.option('debug', {
  describe: 'Output debug information',
  type: 'boolean',
});

y.option('p', {
  alias: 'prefix',
  describe: 'Output prefix',
  default: PREFIX,
  type: 'string',
});
y.option('s', {
  alias: 'separators',
  describe: 'Output list separators (i.e., [separator, lastSeparator])',
  default: [',', 'then'],
  type: 'array',
});
y.option('oc', {
  alias: 'oxford-comma',
  describe: 'Use the Oxford comma (e.g., "Alice, Bob, and Charlie"; applies the separator to the second-to-last item)',
  type: 'boolean',
});
y.option('cc', {
  alias: 'clipboard',
  describe: 'Copy the output to the clipboard (to disable: --no-cc, --no-clipboard))',
  default: true,
  type: 'boolean',
});
y.option('clr', {
  alias: 'colors',
  describe: 'Colorize the output (to disable: --no-clr, --no-colors)',
  default: true,
  type: 'boolean',
});

const argv = y.parse(hideBin(process.argv));
const {message, error} = cli(argv);
message && process.stdout.write(message + '\n');
error && process.stderr.write(error + '\n');
