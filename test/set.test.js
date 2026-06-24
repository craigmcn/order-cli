import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { stdout, stderr } from 'test-console';
import { handler } from '../lib/set.js';
import { CONFIG_FILE_NAME, CONFIG_UPDATE_MSG, DEFAULT_CONFIG } from '../lib/constants.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { TEST_CONFIG } from './constants.js';

describe('Validate set.js', () => {
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

  it('Bootstraps a full default config when none exists yet', function () {
    const output = stdout.inspectSync(() => {
      handler({ key: 'prefix', value: ['Custom: '] });
    });

    const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    expect(written).to.deep.equal({ ...DEFAULT_CONFIG, prefix: 'Custom: ' });
    expect(output[0].toString()).to.contain(CONFIG_UPDATE_MSG);
    expect(output[1].toString()).to.contain('prefix = Custom: ');
  });

  it('Merges into an existing config, preserving untouched keys', function () {
    fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));

    stdout.inspectSync(() => {
      handler({ key: 'prefix', value: ['Updated: '] });
    });

    const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    expect(written).to.deep.equal({ ...TEST_CONFIG, prefix: 'Updated: ' });
  });

  it('Coerces string boolean values for boolean keys', function () {
    fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));

    stdout.inspectSync(() => {
      handler({ key: 'colors', value: ['false'] });
    });

    const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    expect(written.colors).to.equal(false);
  });

  it('Sets an array-typed key and displays it joined for output', function () {
    fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));

    const output = stdout.inspectSync(() => {
      handler({ key: 'separators', value: [';', 'and'] });
    });

    const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    expect(written.separators).to.deep.equal([';', 'and']);
    expect(output[1].toString()).to.contain('separators = ;, and');
  });

  it('Colors output when config.colors is true', function () {
    fs.writeFileSync(configFile, JSON.stringify({ ...TEST_CONFIG, colors: true }));

    const output = stdout.inspectSync(() => {
      handler({ key: 'prefix', value: ['Custom: '] });
    });

    expect(output[0].toString()).to.contain(ANSI_COLORS.BRIGHT_GREEN);
  });

  describe('with -g/--group', () => {
    let config;

    beforeEach(function () {
      config = {
        ...TEST_CONFIG,
        groups: [{ participants: ['Alice', 'Bob'], prefix: 'Old: ' }],
      };
    });

    it('Returns an error when no configuration file exists', function () {
      const output = stderr.inspectSync(() => {
        handler({ key: 'prefix', value: ['New: '], group: 0 });
      });
      expect(output[0].toString()).to.contain('No configuration file found.');
    });

    it('Returns an error when the group is not found', function () {
      fs.writeFileSync(configFile, JSON.stringify(config));

      const output = stderr.inspectSync(() => {
        handler({ key: 'prefix', value: ['New: '], group: 5 });
      });
      expect(output[0].toString()).to.contain('Group 5 not found.');
    });

    it('Returns an error when -g is used but no groups are configured', function () {
      fs.writeFileSync(configFile, JSON.stringify({ ...TEST_CONFIG, groups: undefined }));

      const output = stderr.inspectSync(() => {
        handler({ key: 'prefix', value: ['New: '], group: 0 });
      });
      expect(output[0].toString()).to.contain('Group 0 not found.');
    });

    it('Sets a key on the specified group only, leaving top-level config untouched', function () {
      fs.writeFileSync(configFile, JSON.stringify(config));

      const output = stdout.inspectSync(() => {
        handler({ key: 'prefix', value: ['New: '], group: 0 });
      });

      const written = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      expect(written.groups[0].prefix).to.equal('New: ');
      expect(written.prefix).to.equal(TEST_CONFIG.prefix);
      expect(output[1].toString()).to.contain('prefix = New: ');
    });
  });
});
