/**
 * Repeat a provided input a specified number of times into a new array.
 *
 * @param repeatCount The number of times to repeat the provided repeatable.
 * @param repeatable The thing to repeat.
 * @returns An array of the repeatable repeated the specified number of times.
 */
export const repeat = <T>(repeatCount: number, repeatable: T): Array<T> => Array(repeatCount).fill(repeatable);

/**
 * Map an array of functions to the function result.
 *
 * @param functionArray Array of functions.
 * @returns An array that is the result of calling each of the functions passed.
 */
export const mapArrayOfFunctionCalls = <T>(functionArray: Array<() => T>): Array<T> => functionArray.map(elm => elm());
