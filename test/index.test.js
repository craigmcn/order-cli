import { readFileSync } from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stderr } from 'test-console';
import { execSync } from 'child_process';
import { DEFAULT_ARGV, PARTICIPANTS, TEST_PREFIX, TEST_SEPARATORS } from './constants.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { COPIED, DEBUGGING_INFO, NO_PARTICIPANTS_MSG, PREFIX } from '../lib/constants.js';
import { shuffle } from '../lib/shuffle.js';

const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const { version } = loadJSON('../package.json');

const test = (args) => execSync(`node bin/index.js${args ? ' ' + args : ''}`).toString();

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

  it('should use the provided arguments; single participant', () => {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const result = test(participant);
    expect(result).to.equal(`${ANSI_COLORS.BRIGHT_GREEN}${COPIED}${ANSI_COLORS.DEFAULT}${ANSI_COLORS.WHITE}${PREFIX}${participant}${ANSI_COLORS.DEFAULT}\n`);
  });

  it('should use the provided arguments; multiple participants, no colors', () => {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const result = test(`${participants.join(' ')} --no-colors`);
    expect(result).to.contain(`${COPIED}${PREFIX}`);
    expect(result).to.not.contain(ANSI_COLORS.DEFAULT);
    participants.forEach((participant) => {
      expect(result).to.contain(participant);
    });
  });

  it('should use the provided arguments; multiple participants, Oxford comma', () => {
    const participants = shuffle(PARTICIPANTS).slice(0, 4);
    const result = test(`${participants.join(' ')} --oc`);
    expect(result).to.contain(`${COPIED}${ANSI_COLORS.DEFAULT}${ANSI_COLORS.WHITE}${PREFIX}`);
    expect(result).to.contain(`${DEFAULT_ARGV.s[0]} ${DEFAULT_ARGV.s[1]}`);
    participants.forEach((participant) => {
      expect(result).to.contain(participant);
    });
  });

  it('should use the provided arguments; multiple participants, custom separators, Oxford comma', () => {
    const participants = shuffle(PARTICIPANTS).slice(0, 4);
    const result = test(`--oc -s "${TEST_SEPARATORS.join('" "')}" -- ${participants.join(' ')}`);
    expect(result).to.contain(`${COPIED}${ANSI_COLORS.DEFAULT}${ANSI_COLORS.WHITE}${PREFIX}`);
    expect(result).to.not.contain(`${DEFAULT_ARGV.s[0]} ${DEFAULT_ARGV.s[1]}`);
    expect(result).to.contain(`${TEST_SEPARATORS[0]} ${TEST_SEPARATORS[1]}`);
    participants.forEach((participant) => {
      expect(result).to.contain(participant);
    });
  });

  it('should use the provided arguments; multiple participants, custom prefix', () => {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const result = test(`-p "${TEST_PREFIX}" -- ${participants.join(' ')}`);
    expect(result).to.contain(`${COPIED}${ANSI_COLORS.DEFAULT}${ANSI_COLORS.WHITE}${TEST_PREFIX}`);
    expect(result).to.not.contain(PREFIX);
    participants.forEach((participant) => {
      expect(result).to.contain(participant);
    });
  });
});
