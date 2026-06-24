import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import YAML from 'yaml';
import {
  configurationFile,
  parseConfiguration,
  readConfiguration,
  writeConfiguration,
} from '../lib/configuration.js';
import { CONFIG_FILE_NAME } from '../lib/constants.js';
import { TEST_CONFIG } from './constants.js';

describe('Validate configuration.js', () => {
  let tmpDir;

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'order-cli-'));
    process.env.ORDER_CONFIG_DIR = tmpDir;
  });

  afterEach(function () {
    delete process.env.ORDER_CONFIG_DIR;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('configurationFile()', () => {
    it('Returns exists: false and file: null when no config file is present', function () {
      expect(configurationFile()).to.deep.equal({
        file: null,
        format: null,
        path: tmpDir,
        name: CONFIG_FILE_NAME,
        exists: false,
      });
    });

    it('Returns exists: false instead of throwing when the config directory does not exist', function () {
      const missingDir = path.join(tmpDir, 'nested', 'missing');
      process.env.ORDER_CONFIG_DIR = missingDir;

      expect(configurationFile()).to.deep.equal({
        file: null,
        format: null,
        path: missingDir,
        name: CONFIG_FILE_NAME,
        exists: false,
      });
    });

    it('Finds a .orderrc.json file and reports format json', function () {
      const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
      fs.writeFileSync(file, JSON.stringify(TEST_CONFIG));

      expect(configurationFile()).to.deep.equal({
        file,
        format: 'json',
        path: tmpDir,
        name: `${CONFIG_FILE_NAME}.json`,
        exists: true,
      });
    });

    it('Finds a .orderrc.yaml file and reports format yaml', function () {
      const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.yaml`);
      fs.writeFileSync(file, YAML.stringify(TEST_CONFIG));

      expect(configurationFile()).to.deep.equal({
        file,
        format: 'yaml',
        path: tmpDir,
        name: `${CONFIG_FILE_NAME}.yaml`,
        exists: true,
      });
    });
  });

  describe('parseConfiguration()', () => {
    it('Parses JSON by default', function () {
      expect(parseConfiguration(JSON.stringify(TEST_CONFIG))).to.deep.equal(TEST_CONFIG);
    });

    it('Parses YAML when format is yaml', function () {
      expect(parseConfiguration(YAML.stringify(TEST_CONFIG), 'yaml')).to.deep.equal(TEST_CONFIG);
    });
  });

  describe('readConfiguration()', () => {
    it('Returns {} when no config file exists', function () {
      expect(readConfiguration()).to.deep.equal({});
    });

    it('Reads and parses an existing JSON config file', function () {
      fs.writeFileSync(path.join(tmpDir, `${CONFIG_FILE_NAME}.json`), JSON.stringify(TEST_CONFIG));

      expect(readConfiguration()).to.deep.equal({ config: TEST_CONFIG, format: 'json' });
    });

    it('Reads and parses an existing YAML config file', function () {
      fs.writeFileSync(path.join(tmpDir, `${CONFIG_FILE_NAME}.yaml`), YAML.stringify(TEST_CONFIG));

      expect(readConfiguration()).to.deep.equal({ config: TEST_CONFIG, format: 'yaml' });
    });
  });

  describe('writeConfiguration()', () => {
    it('Throws on an invalid format', function () {
      expect(() => writeConfiguration({}, 'xml')).to.throw('Invalid format: xml');
    });

    it('Creates a new JSON file when none exists yet', function () {
      writeConfiguration(TEST_CONFIG, 'json');

      const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.json`);
      expect(fs.existsSync(file)).to.be.true;
      expect(JSON.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(TEST_CONFIG);
    });

    it('Creates a new YAML file when none exists yet and configFormat is yaml', function () {
      writeConfiguration(TEST_CONFIG, 'yaml');

      const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.yaml`);
      expect(fs.existsSync(file)).to.be.true;
      expect(YAML.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(TEST_CONFIG);
    });

    it('Creates the config directory when it does not exist yet', function () {
      const missingDir = path.join(tmpDir, 'nested', 'missing');
      process.env.ORDER_CONFIG_DIR = missingDir;

      writeConfiguration(TEST_CONFIG, 'json');

      const file = path.join(missingDir, `${CONFIG_FILE_NAME}.json`);
      expect(fs.existsSync(file)).to.be.true;
      expect(JSON.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(TEST_CONFIG);
    });

    it('Writes to the existing file, preserving its format, when one already exists', function () {
      const file = path.join(tmpDir, `${CONFIG_FILE_NAME}.yaml`);
      fs.writeFileSync(file, YAML.stringify(TEST_CONFIG));

      const updated = { ...TEST_CONFIG, prefix: 'Updated: ' };
      writeConfiguration(updated, 'json');

      expect(fs.existsSync(path.join(tmpDir, `${CONFIG_FILE_NAME}.json`))).to.be.false;
      expect(YAML.parse(fs.readFileSync(file, 'utf8'))).to.deep.equal(updated);
    });
  });
});
