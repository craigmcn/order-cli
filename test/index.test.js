import { readFileSync } from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stderr } from 'test-console';
import { execSync } from 'child_process';
import { PARTICIPANTS } from './constants.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { DEBUGGING_INFO, NO_PARTICIPANTS_MSG } from '../lib/constants.js';
import { shuffle } from '../lib/shuffle.js';

const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const { version } = loadJSON('../package.json');

const test = (args) => execSync(`node bin/index.js --env=test${args ? ' ' + args : ''}`).toString();

describe('CLI', () => {
  it('should output help information', () => {
    expect(test('--help').toString()).to.contain('Usage:  index.js [options] [--] <participants...>');
  });

  it('should output version information', () => {
    expect(test('--version')).to.contain(version);
  });
  
  it('should return an error, when no arguments provided', () => {
    const output = stderr.inspectSync(() => {
      test();
    });
    expect(output[0].toString()).to.contain(NO_PARTICIPANTS_MSG);
  });

  it('should output an error, when no participants provided', () => {
    const output = stderr.inspectSync(() => {
      test('--');
    });
    expect(output[0].toString()).to.contain(NO_PARTICIPANTS_MSG);
  });

  it('should output debugging information', () => {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const result = test(`${participant} --debug`);
    expect(result).to.contain(`${ANSI_COLORS.BRIGHT_YELLOW}${DEBUGGING_INFO}${ANSI_COLORS.DEFAULT}\n`);
    expect(result).to.contain(participant);
  });
});
