/**
 * is valid amount or not
 *
 * @param {number} value
 * @returns {boolean}
 */
const isValidNumber = (value: number): boolean => {
  return Number.isFinite(value) && !Number.isNaN(value) && value >= 0;
};

/**
 * is main net or not
 *
 * @returns {boolean}
 */
const isMainnet = (): boolean => {
  return process.env.MAINNET === "true";
};

export { isValidNumber, isMainnet };
