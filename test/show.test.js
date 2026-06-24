import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { stdout, stderr } from 'test-console';
import { handler } from '../lib/show.js';
import { CONFIG_FILE_NAME } from '../lib/constants.js';
import { ANSI_COLORS } from '../lib/colors.js';
import { TEST_CONFIG } from './constants.js';

describe('Validate show.js', () => {
  let tmpDir;
  let configFile;
  let config;

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'order-cli-'));
    process.env.ORDER_CONFIG_DIR = tmpDir;
    configFile = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    config = {
      ...TEST_CONFIG,
      groups: [{ participants: ['Alice', 'Bob'], prefix: 'Group 0: ' }],
    };
  });

  afterEach(function () {
    delete process.env.ORDER_CONFIG_DIR;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('Returns an error when no configuration is found', function () {
    const output = stderr.inspectSync(() => {
      handler({});
    });
    expect(output[0].toString()).to.equal(`${ANSI_COLORS.BRIGHT_YELLOW}No configuration found.\n${ANSI_COLORS.DEFAULT}`);
  });

  it('Displays the full configuration', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({});
    });

    const ret = output.join('');
    expect(ret).to.contain('Configuration');
    expect(ret).to.contain('prefix');
    expect(ret).to.contain(TEST_CONFIG.prefix);
  });

  it('Displays a single group via -g', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stdout.inspectSync(() => {
      handler({ group: 0 });
    });

    const ret = output.join('');
    expect(ret).to.contain('Group: ');
    expect(ret).to.contain('0');
    expect(ret).to.contain('Alice');
    expect(ret).to.not.contain(TEST_CONFIG.prefix);
  });

  it('Returns an error when the group is not found', function () {
    fs.writeFileSync(configFile, JSON.stringify(config));

    const output = stderr.inspectSync(() => {
      handler({ group: 99 });
    });

    expect(output[0].toString()).to.contain('Group 99 not found.');
  });

  it('Returns an error when -g is requested but no groups are configured', function () {
    fs.writeFileSync(configFile, JSON.stringify({ ...config, groups: undefined }));

    const output = stderr.inspectSync(() => {
      handler({ group: 0 });
    });

    expect(output[0].toString()).to.contain('Group 0 not found.');
  });
});
