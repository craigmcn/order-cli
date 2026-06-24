import { expect } from 'chai';
import { describe, it } from 'mocha';
import { formatObject, formatValue } from '../lib/utils.js';
import { ANSI_COLORS } from '../lib/colors.js';

describe('Validate utils.js', () => {
  describe('formatObject()', () => {
    it('Returns an empty string when no object provided', function () {
      expect(formatObject()).to.equal('');
    });
    it('Returns an empty string when empty object provided', function () {
      expect(formatObject({})).to.equal('');
    });
    it('Returns a formatted string, with colours, when object provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatObject(obj)).to.equal(
        `key1: ${ANSI_COLORS.BRIGHT_GREEN}'value1'${ANSI_COLORS.DEFAULT}\n` +
        `key2: ${ANSI_COLORS.BRIGHT_GREEN}'value2'${ANSI_COLORS.DEFAULT}\n`);
    });
    it('Returns a formatted string when object and args provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatObject(obj, false)).to.equal('key1: \'value1\'\nkey2: \'value2\'\n');
    });
    it('Returns a formatted string with braces when object and args provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatObject(obj, false, true)).to.equal('{\n  key1: \'value1\'\n  key2: \'value2\'\n}\n');
    });
    it('Returns a formatted string with colours and braces when object and args provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatObject(obj, true, true)).to.equal('{\n' +
          `  key1: ${ANSI_COLORS.BRIGHT_GREEN}'value1'${ANSI_COLORS.DEFAULT}\n` +
          `  key2: ${ANSI_COLORS.BRIGHT_GREEN}'value2'${ANSI_COLORS.DEFAULT}\n` +
          '}\n');
    });
    it('Returns a formatted string with colours and braces when complex object and args provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
        '3key': true,
        'key-4': ['value4', false],
      };
      expect(formatObject(obj, true, true)).to.equal('{\n' +
          `  key1: ${ANSI_COLORS.BRIGHT_GREEN}'value1'${ANSI_COLORS.DEFAULT}\n` +
          `  key2: ${ANSI_COLORS.BRIGHT_GREEN}'value2'${ANSI_COLORS.DEFAULT}\n` +
          `  ${ANSI_COLORS.BRIGHT_GREEN}'3key'${ANSI_COLORS.DEFAULT}: ` +
          `${ANSI_COLORS.BRIGHT_YELLOW}true${ANSI_COLORS.DEFAULT}\n` +
          `  ${ANSI_COLORS.BRIGHT_GREEN}'key-4'${ANSI_COLORS.DEFAULT}: ` +
          `[ ${ANSI_COLORS.BRIGHT_GREEN}'value4'${ANSI_COLORS.DEFAULT}, ` +
          `${ANSI_COLORS.BRIGHT_YELLOW}false${ANSI_COLORS.DEFAULT} ]\n` +
          '}\n');
    });
  });

  describe('formatValue()', () => {
    it('Returns a formatted string, with colour, when boolean provided', function () {
      expect(formatValue(true)).to.equal(`${ANSI_COLORS.BRIGHT_YELLOW}true${ANSI_COLORS.DEFAULT}`);
    });
    it('Returns a formatted string, with colour, when string provided', function () {
      expect(formatValue('value')).to.equal(`${ANSI_COLORS.BRIGHT_GREEN}'value'${ANSI_COLORS.DEFAULT}`);
    });
    it('Returns a formatted string when array provided', function () {
      expect(formatValue(['value1', 'value2'])).to.equal(
        `[ ${ANSI_COLORS.BRIGHT_GREEN}'value1'${ANSI_COLORS.DEFAULT}, ` +
        `${ANSI_COLORS.BRIGHT_GREEN}'value2'${ANSI_COLORS.DEFAULT} ]`);
    });
    it('Returns a formatted string when boolean provided', function () {
      expect(formatValue(true, false)).to.equal('true');
    });
    it('Returns a formatted string when string provided', function () {
      expect(formatValue('value', false)).to.equal('\'value\'');
    });
    it('Returns a formatted string when complex object provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatValue(obj, false)).to.equal('{\n  key1: \'value1\'\n  key2: \'value2\'\n}\n');
    });
    it('Returns a formatted string, with colour, when complex object provided', function () {
      const obj = {
        key1: 'value1',
        key2: 'value2',
      };
      expect(formatValue(obj, true)).to.equal('{\n' +
        `  key1: ${ANSI_COLORS.BRIGHT_GREEN}'value1'${ANSI_COLORS.DEFAULT}\n` +
        `  key2: ${ANSI_COLORS.BRIGHT_GREEN}'value2'${ANSI_COLORS.DEFAULT}\n` +
        '}\n');
    });
  });
});
