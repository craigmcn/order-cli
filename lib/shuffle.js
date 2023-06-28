/*
  * Shuffle an array using the Fisher-Yates algorithm
  * @param {Array} array - The array to shuffle
  * @returns {Array} The shuffled array
  * @throws {Error} If the argument is not an array
  * 
  * @example
  * shuffle(['a', 'b', 'c', 'd', 'e']); // ['b', 'e', 'a', 'd', 'c']
  * shuffle([1]); // [1]
  * shuffle([]); // []
  * shuffle(); // Error: shuffle() expects an array
  * shuffle('foo'); // Error: shuffle() expects an array
*/
export function shuffle(array) {
  if (!Array.isArray(array)) {
      throw new Error('shuffle() expects an array');
  }

  const returnArray = [...array];
  if (array.length <= 1) {
      return returnArray;
  }

  // Fisher-Yates shuffle
  for (let i = returnArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = returnArray[i];
      returnArray[i] = returnArray[j];
      returnArray[j] = temp;
  }

  return returnArray;
}
