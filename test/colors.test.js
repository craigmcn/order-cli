import { describe, it } from 'mocha';
import { expect } from 'chai';
import colors, { ANSI_COLORS, blue, color, green, red, white, yellow } from '../lib/colors.js';

describe('Validate colors.js', () => {
  it('Returns a wrapped string using function', function () {
    const str = 'test';
    expect(typeof blue(str)).to.be.a('string');
    expect(blue(str)).to.equal(ANSI_COLORS.BRIGHT_CYAN + str + ANSI_COLORS.DEFAULT);

    expect(typeof green(str)).to.be.a('string');
    expect(green(str)).to.equal(ANSI_COLORS.BRIGHT_GREEN + str + ANSI_COLORS.DEFAULT);

    expect(typeof red(str)).to.be.a('string');
    expect(red(str)).to.equal(ANSI_COLORS.BRIGHT_RED + str + ANSI_COLORS.DEFAULT);
    
    expect(typeof white(str)).to.be.a('string');
    expect(white(str)).to.equal(ANSI_COLORS.WHITE + str + ANSI_COLORS.DEFAULT);
    
    expect(typeof yellow(str)).to.be.a('string');
    expect(yellow(str)).to.equal(ANSI_COLORS.BRIGHT_YELLOW + str + ANSI_COLORS.DEFAULT);
  });

  it('Returns a wrapped string using object method', function () {
    const str = 'test';
    expect(typeof colors.blue(str)).to.be.a('string');
    expect(colors.blue(str)).to.equal(ANSI_COLORS.BRIGHT_CYAN + str + ANSI_COLORS.DEFAULT);

    expect(typeof colors.green(str)).to.be.a('string');
    expect(colors.green(str)).to.equal(ANSI_COLORS.BRIGHT_GREEN + str + ANSI_COLORS.DEFAULT);

    expect(typeof colors.red(str)).to.be.a('string');
    expect(colors.red(str)).to.equal(ANSI_COLORS.BRIGHT_RED + str + ANSI_COLORS.DEFAULT);
    
    expect(typeof colors.white(str)).to.be.a('string');
    expect(colors.white(str)).to.equal(ANSI_COLORS.WHITE + str + ANSI_COLORS.DEFAULT);
    
    expect(typeof colors.yellow(str)).to.be.a('string');
    expect(colors.yellow(str)).to.equal(ANSI_COLORS.BRIGHT_YELLOW + str + ANSI_COLORS.DEFAULT);
  });

  describe('color()', () => {
    it('Returns undefined if no arguments provided', function () {
      expect(color()).to.be.undefined;
    });

    it('Returns string if no further arguments provided', function () {
      expect(color('test string')).to.equal('test string');
    });

    it('Returns coloured string, when no `config.colors` value provided', function () {
      expect(color('test string', 'yellow')).to.equal(ANSI_COLORS.BRIGHT_YELLOW + 'test string' + ANSI_COLORS.DEFAULT);
    });

    it('Returns coloured string, when `config.colors` is true', function () {
      expect(color('test string', 'yellow')).to.equal(ANSI_COLORS.BRIGHT_YELLOW + 'test string' + ANSI_COLORS.DEFAULT);
    });

    it('Returns string, when `config.colors` is false', function () {
      expect(color('test string', 'yellow', false)).to.equal('test string');
    });
  });
});
