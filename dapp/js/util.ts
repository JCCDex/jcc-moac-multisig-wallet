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
 * is development enviroment or not
 *
 * @returns {boolean}
 */
const isDev = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export { isValidNumber, isDev };
