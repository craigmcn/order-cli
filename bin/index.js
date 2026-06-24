#! /usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import init from '../lib/init.js';
import cli from '../lib/cli.js';
import { green, white } from '../lib/colors.js';
import { PREFIX } from '../lib/constants.js';
import set from '../lib/set.js';
import rm from '../lib/rm.js';
import show from '../lib/show.js';
import Configuration from '../lib/configuration.js';
// import { TEST_CONFIG } from '../test/constants.js';

/*
order
  init [format=json|yaml] -- creates a config file, if one does not exist
  set <key> [value..] -- sets a key-value pair (defaults) in the config file
  rm <key> [groupIndex] -- removes a key-value pair from the config file
    - if key is 'group', groupIndex is required
  show -- displays the config file (formatted)
  [options] [--] <participants...>
*/

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

y.command('$0', 'Create a random meeting order', cli);
y.command(init);
y.command(set);
y.command(rm);
y.command(show);

y.alias('h', 'help');
y.alias('v', 'version');

const { config } = Configuration.readConfiguration();
y.config(config);

y.parse(hideBin(process.argv));
