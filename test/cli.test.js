import { afterEach, beforeEach, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import clipboard from 'clipboardy';
import { cli } from '../lib/cli.js';
import { COPIED, DEBUGGING_INFO, MAX_PARTICIPANTS_MSG, NO_ARGUMENTS_MSG, NO_PARTICIPANTS_MSG, PREFIX } from '../lib/constants.js';
import { shuffle } from '../lib/shuffle.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { DEFAULT_ARGV, NO_COLOR, NO_COPY, PARTICIPANTS, TEST_PREFIX, TEST_SEPARATORS } from './constants.js';

chai.use(spies);
chai.should();

describe('Validate cli.js', () => {
  let writeSyncSpy;
  beforeEach(function() {
    writeSyncSpy = chai.spy.on(clipboard, 'writeSync');
  });

  afterEach(function() {
    chai.spy.restore(clipboard);
  });

  it('Returns an object with a message and error', function () {
    const ret = cli();
    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    expect(ret.message).to.be.empty;

    expect(ret.error).to.be.a('string');
    expect(ret.error).to.equal(NO_ARGUMENTS_MSG);
  });

  it('Returns an error, when no participants provided', function () {
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR});

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.not.have.been.called();

    expect(ret.message).to.be.empty;

    expect(ret.error).to.be.a('string');
    expect(ret.error).to.equal(NO_PARTICIPANTS_MSG);
  });

  it('Returns an error, with colour, when no participants provided', function () {
    const ret = cli(DEFAULT_ARGV);

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.not.have.been.called();

    expect(ret.message).to.be.empty;

    expect(ret.error).to.be.a('string');
    expect(ret.error).to.equal(`${ANSI_COLORS.BRIGHT_RED}${NO_PARTICIPANTS_MSG}${ANSI_COLORS.DEFAULT}`);
  });

  it('Returns participant, when one participant provided', function () {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participant });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.with.exactly(`${PREFIX}${participant[0]}`);

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.equal(`${COPIED}${PREFIX}${participant[0]}`);
  });

  it('Returns participant, when one participant provided, not copied', function () {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COPY, ...NO_COLOR, _: participant });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.not.have.been.called();
    
    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.equal(`${PREFIX}${participant[0]}`);
  });

  it('Returns participants, when two participants provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 2);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');
    
    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[1]);
    expect(ret.message).to.not.contain(DEFAULT_ARGV.s[0]);
  });

  it('Returns participants, with colour, when multiple participants provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const ret = cli({ ...DEFAULT_ARGV, _: participants });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.contain(participants[2]);
    expect(ret.message).to.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[1]);
  });

  it('Returns participants, when multiple participants and custom separators provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, s: TEST_SEPARATORS });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.contain(participants[2]);
    expect(ret.message).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(TEST_SEPARATORS[0]);
    expect(ret.message).to.contain(TEST_SEPARATORS[1]);
  });

  it('Returns participants, with colour, when multiple participants and Oxford comma provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const ret = cli({ ...DEFAULT_ARGV, _: participants, oc: true });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.contain(participants[2]);
    expect(ret.message).to.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[1]);
    expect(ret.message).to.contain(`${DEFAULT_ARGV.s[0]} ${DEFAULT_ARGV.s[1]}`);
  });

  it('Returns participants, when multiple participants and custom separators and Oxford comma provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, s: TEST_SEPARATORS, oc: true });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.contain(participants[2]);
    expect(ret.message).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(TEST_SEPARATORS[0]);
    expect(ret.message).to.contain(TEST_SEPARATORS[1]);
    expect(ret.message).to.contain(`${TEST_SEPARATORS[0]} ${TEST_SEPARATORS[1]}`);
  });

  it('Returns participants, when multiple participants and custom prefix provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, p: TEST_PREFIX });

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(TEST_PREFIX);
    expect(ret.message).to.contain(participants[0]);
    expect(ret.message).to.contain(participants[1]);
    expect(ret.message).to.contain(participants[2]);
    expect(ret.message).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret.message).to.contain(DEFAULT_ARGV.s[1]);
  });

  it('Returns debug information, when debug flag provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const argv = { ...DEFAULT_ARGV, _: participants, debug: true };
    const ret = cli(argv);

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.have.been.called.once;

    expect(ret.error).to.be.empty;

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.contain(COPIED);
    expect(ret.message).to.contain(ANSI_COLORS.BRIGHT_YELLOW);
    expect(ret.message).to.contain(DEBUGGING_INFO);
    expect(ret.message).to.contain(JSON.stringify(argv, null, 2));
  });

  it('Returns debug information, when debug flag provided, not copied', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const argv = { ...DEFAULT_ARGV, ...NO_COPY, ...NO_COLOR, _: participants, debug: true };
    const ret = cli(argv);

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');
    expect(ret.error).to.be.empty;

    writeSyncSpy.should.not.have.been.called();

    expect(ret.message).to.be.a('string');
    expect(ret.message).to.not.contain(COPIED);
    expect(ret.message).to.not.contain(ANSI_COLORS.BRIGHT_YELLOW);
    expect(ret.message).to.contain(DEBUGGING_INFO);
    expect(ret.message).to.contain(JSON.stringify(argv, null, 2));
  });

  it('Returns an error, when too many participants provided', function () {
    const ret = cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: shuffle(PARTICIPANTS)});

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.not.have.been.called();

    expect(ret.message).to.be.empty;

    expect(ret.error).to.be.a('string');
    expect(ret.error).to.equal(MAX_PARTICIPANTS_MSG);
  });

  it('Returns an error, with colour, when too many participants provided', function () {
    const ret = cli({ ...DEFAULT_ARGV, _: shuffle(PARTICIPANTS)});

    expect(ret).to.be.an('object');
    expect(ret).to.have.property('message');
    expect(ret).to.have.property('error');

    writeSyncSpy.should.not.have.been.called();

    expect(ret.message).to.be.empty;

    expect(ret.error).to.be.a('string');
    expect(ret.error).to.equal(`${ANSI_COLORS.BRIGHT_RED}${MAX_PARTICIPANTS_MSG}${ANSI_COLORS.DEFAULT}`);
  });
});
