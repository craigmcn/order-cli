import { afterEach, beforeEach, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { stdout, stderr } from 'test-console';
import clipboard from 'clipboardy';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { handler as cli } from '../lib/cli.js';
import { COPIED, CONFIG_FILE_NAME, DEBUGGING_INFO, DEFAULT_ARGV, NO_ARGUMENTS_MSG, NO_PARTICIPANTS_MSG, PREFIX } from '../lib/constants.js';
import { shuffle } from '../lib/shuffle.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { NO_COLOR, NO_COPY, PARTICIPANTS, TEST_CONFIG, TEST_PREFIX, TEST_SEPARATORS } from './constants.js';
import { formatObject } from '../lib/utils.js';

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

  it('Returns an error when no arguments provided', function () {
    const output = stderr.inspectSync(() => {
      cli();
    });
    expect(output[0].toString()).to.equal(`${ANSI_COLORS.BRIGHT_RED}${NO_ARGUMENTS_MSG}${ANSI_COLORS.DEFAULT}\n`);
  });

  it('Returns an error when no participants provided', function () {
    const output = stderr.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR});
    });
    expect(output[0].toString()).to.equal(`${NO_PARTICIPANTS_MSG}\n`);
  });

  it('Returns an error, with colour, when no participants provided', function () {
    const output = stderr.inspectSync(() => {
      cli(DEFAULT_ARGV);
    });

    writeSyncSpy.should.not.have.been.called();
    expect(output[0].toString()).to.equal(`${ANSI_COLORS.BRIGHT_RED}${NO_PARTICIPANTS_MSG}${ANSI_COLORS.DEFAULT}\n`);
  });

  it('Returns participant, when one participant provided', function () {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participant });
    });

    writeSyncSpy.should.have.been.called.with.exactly(`${PREFIX}${participant[0]}`);
    expect(output[0].toString()).to.equal(`${COPIED}${PREFIX}${participant[0]}\n`);
  });

  it('Returns participant, when one participant provided, not copied', function () {
    const participant = shuffle(PARTICIPANTS).slice(0, 1);
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COPY, ...NO_COLOR, _: participant });
    });

    writeSyncSpy.should.not.have.been.called();
    expect(output[0].toString()).to.equal(`${PREFIX}${participant[0]}\n`);
  });

  it('Returns participants, when two participants provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 2);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants });
    });
    
    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(DEFAULT_ARGV.s[1]);
    expect(ret).to.not.contain(DEFAULT_ARGV.s[0]);
  });

  it('Returns participants, with colour, when multiple participants provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, _: participants });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret).to.contain(DEFAULT_ARGV.s[1]);
  });

  it('Returns participants, when multiple participants and custom separators provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, separators: TEST_SEPARATORS });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(TEST_SEPARATORS[0]);
    expect(ret).to.contain(TEST_SEPARATORS[1]);
  });

  it('Returns participants, when multiple participants and single custom separator provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, separators: [','] });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(',');
  });

  it('Returns participants, with colour, when multiple participants and Oxford comma provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, _: participants, oxfordComma: true });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret).to.contain(DEFAULT_ARGV.s[1]);
    expect(ret).to.contain(`${DEFAULT_ARGV.s[0]} ${DEFAULT_ARGV.s[1]}`);
  });

  it('Returns participants, when multiple participants and custom separators and Oxford comma provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, separators: TEST_SEPARATORS, oxfordComma: true });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(TEST_SEPARATORS[0]);
    expect(ret).to.contain(TEST_SEPARATORS[1]);
    expect(ret).to.contain(`${TEST_SEPARATORS[0]} ${TEST_SEPARATORS[1]}`);
  });

  it('Returns participants, when multiple participants and custom prefix provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    
    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, prefix: TEST_PREFIX });
    });

    writeSyncSpy.should.have.been.called.once;

    const ret = output[0].toString();
    expect(ret).to.contain(COPIED);
    expect(ret).to.contain(TEST_PREFIX);
    expect(ret).to.contain(participants[0]);
    expect(ret).to.contain(participants[1]);
    expect(ret).to.contain(participants[2]);
    expect(ret).to.not.contain(ANSI_COLORS.WHITE);
    expect(ret).to.contain(DEFAULT_ARGV.s[0]);
    expect(ret).to.contain(DEFAULT_ARGV.s[1]);
  });

  it('Adds a separating space when the custom prefix has no trailing whitespace', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 2);

    const output = stdout.inspectSync(() => {
      cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, prefix: 'No trailing space' });
    });

    const ret = output[0].toString();
    expect(ret).to.match(new RegExp(`${COPIED}No trailing space \\S`));
  });

  it('Returns debug information, when debug flag provided', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const argv = { ...DEFAULT_ARGV, _: participants, debug: true };
    
    const output = stdout.inspectSync(() => {
      cli(argv);
    });

    writeSyncSpy.should.have.been.called.once;

    const debug = output[0].toString();
    const info = output[1].toString();
    const ret = output[2].toString();
    expect(debug).to.contain(ANSI_COLORS.BRIGHT_YELLOW);
    expect(debug).to.contain(DEBUGGING_INFO);
    expect(info).to.contain(formatObject(argv, argv.clr, true));
    expect(ret).to.contain(COPIED);
  });

  it('Returns debug information, when debug flag provided, not copied', function () {
    const participants = shuffle(PARTICIPANTS).slice(0, 3);
    const argv = { ...DEFAULT_ARGV, ...NO_COPY, ...NO_COLOR, _: participants, debug: true };
    
    const output = stdout.inspectSync(() => {
      cli(argv);
    });

    writeSyncSpy.should.not.have.been.called();

    const debug = output[0].toString();
    const info = output[1].toString();
    const ret = output[2].toString();
    expect(ret).to.not.contain(COPIED);
    expect(debug).to.not.contain(ANSI_COLORS.BRIGHT_YELLOW);
    expect(debug).to.contain(DEBUGGING_INFO);
    expect(info).to.contain(formatObject(argv, argv.clr, true));
  });

  describe('groups and saving', () => {
    let tmpDir;
    let configFile;

    beforeEach(function () {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'order-cli-'));
      process.env.ORDER_CONFIG_DIR = tmpDir;
      configFile = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    });

    afterEach(function () {
      delete process.env.ORDER_CONFIG_DIR;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('Resolves participants and options from a saved group via --group', function () {
      fs.writeFileSync(configFile, JSON.stringify({
        ...TEST_CONFIG,
        groups: [{ participants: ['Alice', 'Bob'], prefix: TEST_PREFIX, separators: TEST_SEPARATORS, oxfordComma: false, colors: false, clipboard: false }],
      }));

      const output = stdout.inspectSync(() => {
        cli({ ...DEFAULT_ARGV, group: 0 });
      });

      writeSyncSpy.should.not.have.been.called();
      const ret = output[0].toString();
      expect(ret).to.contain(TEST_PREFIX);
      expect(ret).to.contain('Alice');
      expect(ret).to.contain('Bob');
      expect(ret).to.contain(TEST_SEPARATORS[1]);
    });

    it('Returns an error when --group does not exist', function () {
      fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));

      const output = stderr.inspectSync(() => {
        cli({ ...DEFAULT_ARGV, ...NO_COLOR, group: 5 });
      });

      expect(output[0].toString()).to.equal('Group 5 not found.\n');
    });

    it('Returns a coloured error when --group is requested but no groups are configured', function () {
      fs.writeFileSync(configFile, JSON.stringify({ ...TEST_CONFIG, groups: undefined }));

      const output = stderr.inspectSync(() => {
        cli({ ...DEFAULT_ARGV, group: 0 });
      });

      expect(output[0].toString()).to.equal(`${ANSI_COLORS.BRIGHT_RED}Group 0 not found.\n${ANSI_COLORS.DEFAULT}`);
    });

    it('Persists a new group to the config file when --save is provided', function () {
      fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));
      const participants = shuffle(PARTICIPANTS).slice(0, 2);

      stdout.inspectSync(() => {
        cli({ ...DEFAULT_ARGV, ...NO_COLOR, _: participants, save: true });
      });

      const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      expect(written.groups).to.have.lengthOf(1);
      expect(written.groups[0].participants).to.deep.equal([...participants].sort());
    });
  });
});
