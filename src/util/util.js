/**
 * Returns either the input value, or the default value if it's not between min-max inclusive
 *
 * @param {*} inputValue
 * @param {*} min
 * @param {*} max
 * @param {*} defaultValue
 * @returns
 */
export function getValidValue(inputValue, min, max, defaultValue) {
  let validValue;
  if(inputValue > max) {
    validValue = defaultValue;
  } else if (inputValue < min || !inputValue) {
    validValue = defaultValue;
  }

  return validValue;
}
