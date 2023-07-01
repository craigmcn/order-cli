import colors, { green, red, white, yellow } from '../lib/colors.js';

test('Returns a wrapped string using function', function () {
  const str = 'test';
  expect(typeof green(str)).toBe('string');
  expect(green(str)).toEqual('\u001b[92m' + str + '\u001b[0m');

  expect(typeof red(str)).toBe('string');
  expect(red(str)).toEqual('\u001b[91m' + str + '\u001b[0m');
  
  expect(typeof white(str)).toBe('string');
  expect(white(str)).toEqual('\u001b[97m' + str + '\u001b[0m');
  
  expect(typeof yellow(str)).toBe('string');
  expect(yellow(str)).toEqual('\u001b[93m' + str + '\u001b[0m');
});

test('Returns a wrapped string using object method', function () {
  const str = 'test';
  expect(typeof colors.green(str)).toBe('string');
  expect(colors.green(str)).toEqual('\u001b[92m' + str + '\u001b[0m');

  expect(typeof colors.red(str)).toBe('string');
  expect(colors.red(str)).toEqual('\u001b[91m' + str + '\u001b[0m');
  
  expect(typeof colors.white(str)).toBe('string');
  expect(colors.white(str)).toEqual('\u001b[97m' + str + '\u001b[0m');
  
  expect(typeof colors.yellow(str)).toBe('string');
  expect(colors.yellow(str)).toEqual('\u001b[93m' + str + '\u001b[0m');
});
