import { PREFIX } from '../lib/constants.js';

export const DEFAULT_ARGV = {
  _: [],
  'cc': true,
  'clr': true,
  'debug': false,
  'oc': false,
  'p': PREFIX,
  's': [',', 'then'],
};

export const PARTICIPANTS = [
  'Alice',
  'Bob',
  'Charlie',
  'Dave',
  'Eve',
  'Frank',
  'Grace',
  'Heidi',
  'Ivan',
  'Judy',
  'Kevin',
  'Larry',
  'Mallory',
  'Niaj',
  'Oscar',
  'Peggy',
  'Quentin',
];

export const NO_COPY = { cc: false };
export const NO_COLOR = { clr: false };
export const TEST_PREFIX = 'Here\'s the order: ';
export const TEST_SEPARATORS = [';', 'and'];
