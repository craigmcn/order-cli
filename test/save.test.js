import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { stdout, stderr } from 'test-console';
import { save } from '../lib/save.js';
import { CONFIG_FILE_NAME } from '../lib/constants.js';
import { TEST_CONFIG } from './constants.js';

describe('Validate save.js', () => {
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

  function readWritten() {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }

  it('Returns an error when no configuration file exists', function () {
    const output = stderr.inspectSync(() => {
      save({ _: ['Alice', 'Bob'] });
    });
    expect(output[0].toString()).to.contain('No configuration file found for saving.');
    expect(fs.existsSync(configFile)).to.be.false;
  });

  it('Appends a new group when the participant list is not already saved', function () {
    fs.writeFileSync(configFile, JSON.stringify(TEST_CONFIG));

    const output = stdout.inspectSync(() => {
      save({ _: ['Bob', 'Alice'], prefix: 'Custom: ', separators: [',', 'and'], oxfordComma: false, colors: true, clipboard: true });
    });

    const written = readWritten();
    expect(written.groups).to.have.lengthOf(1);
    expect(written.groups[0].participants).to.deep.equal(['Alice', 'Bob']);
    expect(output[1].toString()).to.contain('group 0');
  });

  it('Upserts an existing group with the same sorted participants instead of duplicating it', function () {
    const existing = {
      ...TEST_CONFIG,
      groups: [{ participants: ['Alice', 'Bob'], prefix: 'Old: ' }],
    };
    fs.writeFileSync(configFile, JSON.stringify(existing));

    const output = stdout.inspectSync(() => {
      save({ _: ['Bob', 'Alice'], prefix: 'New: ', separators: [',', 'and'], oxfordComma: false, colors: true, clipboard: true });
    });

    const written = readWritten();
    expect(written.groups).to.have.lengthOf(1);
    expect(written.groups[0].prefix).to.equal('New: ');
    expect(output[1].toString()).to.contain('group 0');
  });
});
