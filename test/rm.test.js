import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { stdout, stderr } from 'test-console';
import { handler } from '../lib/rm.js';
import { CONFIG_FILE_NAME, CONFIG_UPDATE_MSG } from '../lib/constants.js';
import { TEST_CONFIG } from './constants.js';

describe('Validate rm.js', () => {
  let tmpDir;
  let configFile;
  let config;

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'order-cli-'));
    process.env.ORDER_CONFIG_DIR = tmpDir;
    configFile = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    config = {
      ...TEST_CONFIG,
      groups: [
        { participants: ['Alice', 'Bob'], prefix: 'Group 0: ' },
        { participants: ['Charlie', 'Dave'], prefix: 'Group 1: ' },
      ],
    };
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
      handler({ key: 'prefix' });
    });
    expect(output[0].toString()).to.contain('No configuration file found.');
  });

  it('Removes a scalar top-level key', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({ key: 'prefix' });
    });

    expect(readWritten()).to.not.have.property('prefix');
    expect(output[0].toString()).to.contain(CONFIG_UPDATE_MSG);
    expect(output[1].toString()).to.contain('Removed prefix');
  });

  it('Removes a scalar top-level key without colorizing output when colors is false', function () {
    fs.writeFileSync(configFile, JSON.stringify({ ...config, colors: false }));

    const output = stdout.inspectSync(() => {
      handler({ key: 'prefix' });
    });

    expect(output[0].toString()).to.equal(CONFIG_UPDATE_MSG);
    expect(output[1].toString()).to.equal('Removed prefix');
  });

  it('Removes an array element from a top-level array-typed key', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({ key: 'separators', index: 0 });
    });

    expect(readWritten().separators).to.deep.equal([TEST_CONFIG.separators[1]]);
    expect(output[1].toString()).to.contain('Removed separators[0]');
  });

  it('Returns an error for an out-of-range index', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stderr.inspectSync(() => {
      handler({ key: 'separators', index: 99 });
    });

    expect(output[0].toString()).to.contain('Index 99 does not exist.');
    expect(readWritten()).to.deep.equal(config);
  });

  it('Removes a key from a specific group via -g', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({ key: 'prefix', group: 0 });
    });

    expect(readWritten().groups[0]).to.not.have.property('prefix');
    expect(readWritten().groups[1]).to.have.property('prefix');
    expect(output[1].toString()).to.contain('Removed prefix');
  });

  it('Returns an error when the group is not found', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stderr.inspectSync(() => {
      handler({ key: 'prefix', group: 99 });
    });

    expect(output[0].toString()).to.contain('Group 99 not found.');
    expect(readWritten()).to.deep.equal(config);
  });

  it('Removes a whole group by index, including index 0', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({ key: 'groups', index: 0 });
    });

    expect(readWritten().groups).to.deep.equal([config.groups[1]]);
    expect(output[1].toString()).to.contain('Removed groups[0]');
  });

  it('Returns an error when removing a group without an index', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stderr.inspectSync(() => {
      handler({ key: 'groups' });
    });

    expect(output[0].toString()).to.contain('Index is required to remove a group.');
    expect(readWritten()).to.deep.equal(config);
  });
});
