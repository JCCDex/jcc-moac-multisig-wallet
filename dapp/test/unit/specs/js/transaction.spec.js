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

    test("if request fail more than tenth", async () => {
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.resolves(config.testNode);
      const stub1 = sandbox.stub(Moac.prototype, "getTransactionReceipt");
      stub1.onCall(0).rejects(new Error("request receipt failed"));
      stub1.onCall(1).rejects(new Error("request receipt failed"));
      stub1.onCall(2).rejects(new Error("request receipt failed"));
      stub1.onCall(3).rejects(new Error("request receipt failed"));
      stub1.onCall(4).rejects(new Error("request receipt failed"));
      stub1.onCall(5).rejects(new Error("request receipt failed"));
      stub1.onCall(6).rejects(new Error("request receipt failed"));
      stub1.onCall(7).rejects(new Error("request receipt failed"));
      stub1.onCall(8).rejects(new Error("request receipt failed"));
      stub1.onCall(9).rejects(new Error("request receipt failed"));
      try {
        const res = await transaction.requestReceipt(config.testHash);
        expect(res).toBe(null);
        expect(stub1.callCount).toBe(10);
      } catch (error) {}
    })

    test("if request fail firstly", async () => {
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.resolves(config.testNode);
      const stub1 = sandbox.stub(Moac.prototype, "getTransactionReceipt");
      stub1.onCall(0).rejects(new Error("request receipt failed"));
      stub1.onCall(1).resolves({});
      try {
        const res = await transaction.requestReceipt(config.testHash);
        expect(res).toBe({});
        expect(stub1.callCount).toBe(2);
      } catch (error) {}
    })
  })

  describe("test isSuccessful", () => {

    test("return true if status is '0x1'", () => {
      expect(transaction.isSuccessful({ status: '0x1' })).toBe(true);
    })

    test("return false if status is '0x0'", () => {
      expect(transaction.isSuccessful({ status: '0x0' })).toBe(false);
    })
  })
})