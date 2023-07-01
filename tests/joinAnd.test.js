import { joinAnd } from '../lib/joinAnd.js';

test('Returns a joined array as a string', function () {
  expect(typeof joinAnd()).toBe('string');
});

test('Returns an empty array as an empty string', function () {
  expect(joinAnd([])).toEqual('');
});

test('Returns a single array entry as a string', function () {
  expect(joinAnd(["participant"])).toEqual('participant');
});

test('Returns a joined list', function () {
  expect(joinAnd(["participant", "participant_2"])).toEqual('participant and participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"])).toEqual('participant, participant_2 and participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"])).toEqual('test_1, test_2, test_3 and test_4');
});

test('Returns a joined list with a custom separator', function () {
  expect(joinAnd(["participant", "participant_2"], {separator: ";"})).toEqual('participant and participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"], {separator: ";"})).toEqual('participant; participant_2 and participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"], {separator: ";"})).toEqual('test_1; test_2; test_3 and test_4');
});

test('Returns a joined list with a custom last separator', function () {
  expect(joinAnd(["participant", "participant_2"], {lastSeparator: "and then"})).toEqual('participant and then participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"], {lastSeparator: "and then"})).toEqual('participant, participant_2 and then participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"], {lastSeparator: "and then"})).toEqual('test_1, test_2, test_3 and then test_4');
});

test('Returns a joined list with a custom separators', function () {
  expect(joinAnd(["participant", "participant_2"], {separator: ";", lastSeparator: "and then"})).toEqual('participant and then participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"], {separator: ";", lastSeparator: "and then"})).toEqual('participant; participant_2 and then participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"], {separator: ";", lastSeparator: "and then"})).toEqual('test_1; test_2; test_3 and then test_4');
});

test('Returns a joined list with an Oxford comma', function () {
  expect(joinAnd(["participant", "participant_2"], {oxfordComma: true})).toEqual('participant and participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"], {oxfordComma: true})).toEqual('participant, participant_2, and participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"], {oxfordComma: true})).toEqual('test_1, test_2, test_3, and test_4');
});

test('Returns a joined list with a custom separators and an Oxford comma', function () {
  expect(joinAnd(["participant", "participant_2"], {separator: ";", lastSeparator: "and then", oxfordComma: true})).toEqual('participant and then participant_2');
  expect(joinAnd(["participant", "participant_2", "participant_3"], {separator: ";", lastSeparator: "and then", oxfordComma: true})).toEqual('participant; participant_2; and then participant_3');
  expect(joinAnd(["test_1", "test_2", "test_3", "test_4"], {separator: ";", lastSeparator: "and then", oxfordComma: true})).toEqual('test_1; test_2; test_3; and then test_4');
});
