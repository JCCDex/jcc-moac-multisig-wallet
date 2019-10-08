import tpInfo from "@/js/tp";
import tp from "tp-js-sdk";
import sinon from "sinon";
import config from "@/test/unit/config";
const sandbox = sinon.createSandbox();

describe("test tp.ts", () => {

  describe("test destroy", () => {
    test("destroy should be a function", () => {
      expect(typeof tpInfo.destroy).toBe("function")
    })
  })

  describe("test getAddress", () => {

    beforeEach(() => {
      sandbox.restore();
      tpInfo.destroy();
    });

    test("getAddress should be a function", () => {
      expect(typeof tpInfo.getAddress).toBe("function")
    })

    test("return configured address when the enviroment is development", async () => {
      process.env.MOAC_ADDRESS = config.testAddress;
      process.env.NODE_ENV = "development";
      const spy = sandbox.spy(tp, "getCurrentWallet");
      const address = await tpInfo.getAddress();
      expect(address).toBe(config.testAddress);
      expect(spy.called).toBe(false);
    })

    test("getCurrentWallet should be called and only be called once if get success when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      const stub = sandbox.stub(tp, "getCurrentWallet");
      stub.resolves({ result: true, data: { address: "test" } });
      let address = await tpInfo.getAddress();
      expect(address).toBe("test");
      expect(stub.called).toBe(true);
      address = await tpInfo.getAddress();
      expect(address).toBe("test");
      expect(stub.calledOnce).toBe(true);
    })

    test("return null if get fail when the enviroment is production", async () => {
      const stub = sandbox.stub(tp, "getCurrentWallet");
      stub.onCall(0).rejects();
      stub.onCall(1).resolves({});
      let address = await tpInfo.getAddress();
      expect(address).toBe(null);
      expect(stub.calledOnce).toBe(true);
      tpInfo.destroy();
      address = await tpInfo.getAddress();
      expect(address).toBe(null);
      expect(stub.calledTwice).toBe(true);
    })
  })

  describe("test getNode", () => {

    beforeEach(() => {
      sandbox.restore();
      tpInfo.destroy();
    });

    test("getNode should be a function", () => {
      expect(typeof tpInfo.getNode).toBe("function")
    })

    test("return configured node when the node is test net", async () => {
      process.env.NODE = config.testNode;
      process.env.MAINNET = "false";
      const spy = sandbox.spy(tp, "getNodeUrl");
      const node = await tpInfo.getNode();
      expect(node).toBe(config.testNode);
      expect(spy.called).toBe(false);
    })

    test("getNode should be called and only be called once if get success when the node is main net", async () => {
      process.env.MAINNET = "true";
      const stub = sandbox.stub(tp, "getNodeUrl");
      stub.resolves({ result: true, data: { nodeUrl: "http://localhost:8080" } });
      let node = await tpInfo.getNode();
      expect(node).toBe("http://localhost:8080");
      expect(stub.calledOnceWithExactly({ blockchain: "moac" })).toBe(true);
      node = await tpInfo.getNode();
      expect(node).toBe("http://localhost:8080");
      expect(stub.calledOnce).toBe(true);
    })

    test("return configured node if called getNodeUrl fail when the node is main net", async () => {
      const stub = sandbox.stub(tp, "getNodeUrl");
      stub.onCall(0).rejects();
      stub.onCall(1).resolves({});
      let node = await tpInfo.getNode();
      expect(node).toBe("http://localhost");
      expect(stub.calledOnce).toBe(true);
      tpInfo.destroy();
      node = await tpInfo.getNode();
      expect(node).toBe("http://localhost");
      expect(stub.calledTwice).toBe(true);
    })
  })
})