import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import YAML from 'yaml';
import { stdout, stderr } from 'test-console';
import { handler } from '../lib/init.js';
import { CONFIG_FILE_NAME, DEFAULT_CONFIG } from '../lib/constants.js';
import { ANSI_COLORS } from '../lib/colors.js';

describe('Validate init.js', () => {
  let tmpDir;

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'order-cli-'));
    process.env.ORDER_CONFIG_DIR = tmpDir;
  });

  afterEach(function () {
    delete process.env.ORDER_CONFIG_DIR;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('Creates a JSON config file by default', function () {
    const output = stdout.inspectSync(() => {
      handler({ format: 'json' });
    });

    const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    expect(fs.existsSync(file)).to.be.true;
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(DEFAULT_CONFIG);
    expect(output[0].toString()).to.contain('Created config file:');
    expect(output[1].toString()).to.contain(file);
  });

  it('Creates a YAML config file when --format=yaml', function () {
    const output = stdout.inspectSync(() => {
      handler({ format: 'yaml' });
    });

    const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.yaml`);
    expect(fs.existsSync(file)).to.be.true;
    expect(YAML.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(DEFAULT_CONFIG);
    expect(output[1].toString()).to.contain(file);
  });

  it('Creates a JSON config file when --format is mixed-case', function () {
    const output = stdout.inspectSync(() => {
      handler({ format: 'JSON' });
    });

    const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    expect(fs.existsSync(file)).to.be.true;
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(DEFAULT_CONFIG);
    expect(output[1].toString()).to.contain(file);
  });

  it('Returns an error for an invalid format', function () {
    const output = stderr.inspectSync(() => {
      handler({ format: 'bogus' });
    });

    expect(output[0].toString()).to.contain('Invalid format: ');
    expect(output[1].toString()).to.contain('bogus');
    expect(output[2].toString()).to.contain('Allowed formats: ');
    expect(fs.readdirSync(tmpDir)).to.deep.equal([]);
  });

  it('Refuses to overwrite an existing config file', function () {
    const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
    fs.writeFileSync(file, JSON.stringify({ foo: 'bar' }));

    const output = stderr.inspectSync(() => {
      handler({ format: 'json' });
    });

    expect(output[0].toString()).to.contain('Configuration file already exists: ');
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal({ foo: 'bar' });
  });

  it('Colors output when requested via ANSI codes', function () {
    const output = stdout.inspectSync(() => {
      handler({ format: 'json' });
    });

    expect(output[0].toString()).to.contain(ANSI_COLORS.BRIGHT_CYAN);
  });
});
