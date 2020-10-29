/**
 *  Comprueba si una variable es un array y no está vacío
 *
 * @param {Array} array
 */

const isArrayNotEmpty = (array) => Array.isArray(array) && array.length > 0;

export default isArrayNotEmpty;
