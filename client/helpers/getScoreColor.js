/**
 * Converts integer to a hexidecimal code, prepad's single
 * digit hex codes with 0 to always return a two digit code.
 *
 * @param {Integer} i Integer to convert
 * @returns {String} The hexidecimal code
 */
function intToHex(i) {
  const hex = parseInt(i, 10).toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
}

/**
 * Return hex color from scalar *value*.
 *
 * @param {float} value Scalar value between 0 and 100
 * @return {String} color
 */
const getScoreColor = val => {
  // value must be between [0, 510]
  let value = Math.min(Math.max(0, val / 100), 1) * 510;

  let redValue;
  let greenValue;
  if (value < 255) {
    redValue = 255;
    greenValue = Math.sqrt(value) * 16;
    greenValue = Math.round(greenValue);
  } else {
    greenValue = 255;
    value -= 255;
    redValue = 256 - (value * value) / 255;
    redValue = Math.round(redValue);
  }

  return `#${intToHex(redValue)}${intToHex(greenValue)}00`;
};

export default getScoreColor;
