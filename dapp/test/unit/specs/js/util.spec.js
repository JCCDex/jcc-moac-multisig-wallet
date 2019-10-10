import * as util from "@/js/util";

describe("test util.ts", () => {

  describe("test isValidNumber", () => {
    test("return true if the input value is valid number", () => {
      expect(util.isValidNumber(0)).toBe(true)
      expect(util.isValidNumber(0.1111)).toBe(true);
    })

    test("return false if the input value isn't valid number", () => {
      const values = [null, undefined, {}, -1, Infinity, NaN, "1"];
      for (const value of values) {
        expect(util.isValidNumber(value)).toBe(false);
      }
    })
  })

  describe("test isMainnet", () => {
    test("return true if the MAINNET is 'true'", () => {
      process.env.MAINNET = "true";
      expect(util.isMainnet()).toBe(true);
    })

    test("return false if the MAINNET is 'false'", () => {
      process.env.MAINNET = "false";
      expect(util.isMainnet()).toBe(false);
    })
  })
})