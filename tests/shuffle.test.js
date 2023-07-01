import { shuffle } from '../lib/shuffle.js';

test('Throws an error if not passed an array', function () {
  expect(() => shuffle()).toThrow('shuffle() expects an array');
  expect(() => shuffle('foo')).toThrow('shuffle() expects an array');
});

test('Returns the same array, if length is less than or equal to 1', function () {
  expect(shuffle([])).toEqual([]);
  expect(shuffle([1])).toEqual([1]);
});

test('Returns the same array values - simple', function () {
  expect(shuffle([1, 2])).toEqual(expect.arrayContaining([1, 2]));
  expect(shuffle([1, 2, 3])).toEqual(expect.arrayContaining([1, 2, 3]));
});

test('Returns the same array values - complex', function () {
  const test1 = [1, 2, 3, 4, 5];
  const shuffledTest1 = shuffle(test1);
  expect(test1).toEqual(expect.arrayContaining(shuffledTest1));
  expect(shuffledTest1).toEqual(expect.arrayContaining(test1));

  const test2 = ['foo', 'bar', 'baz', 'qux', 'quux'];
  const shuffledTest2 = shuffle(test2);
  expect(test2).toEqual(expect.arrayContaining(shuffledTest2));
  expect(shuffledTest2).toEqual(expect.arrayContaining(test2));
});
 