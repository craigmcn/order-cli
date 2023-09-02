import { describe, it } from 'mocha';
import { expect } from 'chai';
import { punctuatedList } from '../lib/punctuatedList.js';

describe('Validate punctuatedList.js', () => {
  it('Returns a joined array as a string', function () {
    expect(typeof punctuatedList()).to.be.a('string');
  });

  it('Returns an empty array as an empty string', function () {
    expect(punctuatedList([])).to.equal('');
  });

  it('Throws an error if not passed an array', function () {
    expect(() => punctuatedList({})).to.throw('punctuatedList() expects an array');
    expect(() => punctuatedList('foo')).to.throw('punctuatedList() expects an array');
  });

  it('Returns a single array entry as a string', function () {
    expect(punctuatedList(['participant'])).to.equal('participant');
  });

  it('Returns a punctuated list', function () {
    expect(punctuatedList(['participant', 'participant_2'])).to.equal('participant and participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'])).to.equal('participant, participant_2 and participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'])).to.equal('test_1, test_2, test_3 and test_4');
  });

  it('Returns a punctuated list with a custom separator', function () {
    expect(punctuatedList(['participant', 'participant_2'], {separator: ';'})).to.equal('participant and participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {separator: ';'})).to.equal('participant; participant_2 and participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {separator: ';'})).to.equal('test_1; test_2; test_3 and test_4');
  });

  it('Returns a punctuated list with a custom last separator', function () {
    expect(punctuatedList(['participant', 'participant_2'], {lastSeparator: 'and then'})).to.equal('participant and then participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {lastSeparator: 'and then'})).to.equal('participant, participant_2 and then participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {lastSeparator: 'and then'})).to.equal('test_1, test_2, test_3 and then test_4');
  });

  it('Returns a punctuated list with custom separators', function () {
    expect(punctuatedList(['participant', 'participant_2'], {separator: ';', lastSeparator: 'and then'})).to.equal('participant and then participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {separator: ';', lastSeparator: 'and then'})).to.equal('participant; participant_2 and then participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {separator: ';', lastSeparator: 'and then'})).to.equal('test_1; test_2; test_3 and then test_4');
  });

  it('Returns a punctuated list with an Oxford comma', function () {
    expect(punctuatedList(['participant', 'participant_2'], {oxfordComma: true})).to.equal('participant and participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {oxfordComma: true})).to.equal('participant, participant_2, and participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {oxfordComma: true})).to.equal('test_1, test_2, test_3, and test_4');
  });

  it('Returns a punctuated list with custom separators and an Oxford comma', function () {
    expect(punctuatedList(['participant', 'participant_2'], {separator: ';', lastSeparator: 'and then', oxfordComma: true})).to.equal('participant and then participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {separator: ';', lastSeparator: 'and then', oxfordComma: true})).to.equal('participant; participant_2; and then participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {separator: ';', lastSeparator: 'and then', oxfordComma: true})).to.equal('test_1; test_2; test_3; and then test_4');
  });

  it('Returns a punctuated list with one custom separator', function () {
    expect(punctuatedList(['participant', 'participant_2'], {separator: ',', lastSeparator: ','})).to.equal('participant, participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {separator: ',', lastSeparator: ','})).to.equal('participant, participant_2, participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {separator: ',', lastSeparator: ','})).to.equal('test_1, test_2, test_3, test_4');
  });

  it('Returns a punctuated list with one custom separator and an Oxford comma', function () {
    expect(punctuatedList(['participant', 'participant_2'], {separator: ',', lastSeparator: ',', oxfordComma: true})).to.equal('participant, participant_2');
    expect(punctuatedList(['participant', 'participant_2', 'participant_3'], {separator: ',', lastSeparator: ',', oxfordComma: true})).to.equal('participant, participant_2, participant_3');
    expect(punctuatedList(['test_1', 'test_2', 'test_3', 'test_4'], {separator: ',', lastSeparator: ',', oxfordComma: true})).to.equal('test_1, test_2, test_3, test_4');
  });
});
