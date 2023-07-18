import { describe, it } from 'mocha';
import { expect } from 'chai';
import colors, { green, red, white, yellow } from '../lib/colors.js';

describe('Validate colors.js', () => {
  it('Returns a wrapped string using function', function () {
    const str = 'test';
    expect(typeof green(str)).to.be.a('string');
    expect(green(str)).to.equal('\u001b[92m' + str + '\u001b[0m');

    expect(typeof red(str)).to.be.a('string');
    expect(red(str)).to.equal('\u001b[91m' + str + '\u001b[0m');
    
    expect(typeof white(str)).to.be.a('string');
    expect(white(str)).to.equal('\u001b[97m' + str + '\u001b[0m');
    
    expect(typeof yellow(str)).to.be.a('string');
    expect(yellow(str)).to.equal('\u001b[93m' + str + '\u001b[0m');
  });

  it('Returns a wrapped string using object method', function () {
    const str = 'test';
    expect(typeof colors.green(str)).to.be.a('string');
    expect(colors.green(str)).to.equal('\u001b[92m' + str + '\u001b[0m');

    expect(typeof colors.red(str)).to.be.a('string');
    expect(colors.red(str)).to.equal('\u001b[91m' + str + '\u001b[0m');
    
    expect(typeof colors.white(str)).to.be.a('string');
    expect(colors.white(str)).to.equal('\u001b[97m' + str + '\u001b[0m');
    
    expect(typeof colors.yellow(str)).to.be.a('string');
    expect(colors.yellow(str)).to.equal('\u001b[93m' + str + '\u001b[0m');
  });
});
