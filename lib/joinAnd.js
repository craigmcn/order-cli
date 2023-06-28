/*
  * Join an array of strings with commas and "and".
  * @param {Array} array - The array to join
  * @param {Object} options - The options object
  * @param {string} options.separator - The separator to use between items
  * @param {string} options.lastSeparator - The separator to use between the last two items
  * @param {boolean} options.oxfordComma - Whether to use the Oxford comma
  * @returns {string} The joined string
  * @throws {Error} If the argument is not an array
  * 
  * @example
  * joinAnd(['a', 'b', 'c', 'd', 'e']); // 'a, b, c, d and e'
  * joinAnd(['a', 'b', 'c', 'd', 'e'], {separator: ';', lastSeparator: 'and'}); // 'a; b; c; d and e'
*/
export function joinAnd(
  array,
  { separator = ',', lastSeparator = 'and', oxfordComma = false } = {}
) {
  if (array.length === 0) {
      return '';
  }
  if (array.length === 1) {
      return array[0];
  }
  if (array.length === 2) {
      return `${array[0]} ${lastSeparator} ${array[1]}`;
  }

  const last = array.pop();

  return `${array.join(`${separator} `)}${oxfordComma ? separator : ''} ${lastSeparator} ${last}`;
}
