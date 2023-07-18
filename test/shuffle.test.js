import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import { shuffle } from '../lib/shuffle.js';

chai.use(assertArrays);

describe('Validate shuffle.js', () => {
  it('Throws an error if not passed an array', function () {
    expect(() => shuffle()).to.throw('shuffle() expects an array');
    expect(() => shuffle('foo')).to.throw('shuffle() expects an array');
  });

  it('Returns the same array, if length is less than or equal to 1', function () {
    expect(shuffle([])).to.be.an('array').that.is.empty;
    expect(shuffle([1])).to.be.equalTo([1]);
  });

  it('Returns the same array values - simple', function () {
    expect(shuffle([1, 2])).to.be.containingAllOf([1, 2]);
    expect(shuffle([1, 2, 3])).to.be.containingAllOf([1, 2, 3]);
  });

  it('Returns the same array values - complex', function () {
    const test1 = [1, 2, 3, 4, 5];
    const shuffledTest1 = shuffle(test1);
    expect(test1).to.be.containingAllOf(shuffledTest1);
    expect(shuffledTest1).to.be.containingAllOf(test1);

    const test2 = ['foo', 'bar', 'baz', 'qux', 'quux'];
    const shuffledTest2 = shuffle(test2);
    expect(test2).to.be.containingAllOf(shuffledTest2);
    expect(shuffledTest2).to.be.containingAllOf(test2);
  });
});
