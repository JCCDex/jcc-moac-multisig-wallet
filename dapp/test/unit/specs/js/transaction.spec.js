import { Moac } from "jcc-moac-utils";
import tpInfo from "@/js/tp";
import * as transaction from "@/js/transaction";
import sinon from "sinon";
import config from "@/test/unit/config";
const sandbox = sinon.createSandbox();

describe("test transaction.ts", () => {

  describe("test requestReceipt", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.resolves(config.testNode);
      const stub1 = sandbox.stub(Moac.prototype, "getTransactionReceipt");
      stub1.resolves({});
      const receipt = await transaction.requestReceipt(config.testHash);
      expect(stub1.calledOnceWithExactly(config.testHash)).toBe(true);
      expect(receipt).toEqual({});
    })

    test("if request fail", async () => {
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.resolves(config.testNode);
      const stub1 = sandbox.stub(Moac.prototype, "getTransactionReceipt");
      stub1.rejects(new Error("request receipt failed"));
      try {
        await transaction.requestReceipt(config.testHash);
      } catch (error) {
        expect(error.message).toBe("request receipt failed")
      }
    })
  })

  describe("test isSuccessful", () => {

    test("return true if status is '0x1'", () => {
      expect(transaction.isSuccessful({ status: '0x1' })).toBe(true);
    })

    test("return true if status is '0x0'", () => {
      expect(transaction.isSuccessful({ status: '0x0' })).toBe(false);
    })
  })
})