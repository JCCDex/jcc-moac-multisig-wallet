import * as util from "@/js/util";

describe("test util.ts", () => {

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