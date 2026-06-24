import os from 'os';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { CONFIG_FILE_FORMATS, CONFIG_FILE_NAME } from './constants.js';

export function configurationFile() {
  const configDir = process.env.ORDER_CONFIG_DIR || os.homedir();
  const file = CONFIG_FILE_FORMATS
    .map(format => `${CONFIG_FILE_NAME}.${format}`)
    .find(name => fs.existsSync(path.join(configDir, name)));

  if (!file) return {
    file: null,
    format: null,
    path: configDir,
    name: CONFIG_FILE_NAME,
    exists: false,
  };

  return {
    file: path.join(configDir, file),
    format: path.extname(file).slice(1),
    path: configDir,
    name: file,
    exists: true,
  };
}

export function parseConfiguration(config, format = 'json') {
  return format === 'json' ? JSON.parse(config) : YAML.parse(config);
}

export function readConfiguration() {
  const { file, format, exists } = configurationFile();

  if (!exists) return {};

  const contents = fs.readFileSync(file, 'utf8');

  return {
    config: parseConfiguration(contents, format),
    format,
  };
}

export function writeConfiguration(config, configFormat = 'json') {
  if (!CONFIG_FILE_FORMATS.includes(configFormat)) {
    throw new Error(`Invalid format: ${configFormat}`);
  }

  const { file, format, path: dir, name, exists } = configurationFile();
  const targetFile = exists ? file : path.join(dir, `${name}.${configFormat}`);
  const targetFormat = exists ? format : configFormat;

  const contents = targetFormat === 'yaml'
    ? YAML.stringify(config)
    : JSON.stringify(config, null, 2);

  if (!exists) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetFile, contents);
  return config;
}

export default {
  configurationFile,
  parseConfiguration,
  readConfiguration,
  writeConfiguration,
};
