import tpInfo from "@/js/tp";
import voteInfo from "@/js/vote";
import multisigContractInstance from "@/js/contract";
import { MultisigContract } from "@/js/contract";
import sinon from "sinon";
import config from "@/test/unit/config";
const sandbox = sinon.createSandbox();

describe("test vote.ts", () => {

  describe("test destroy", () => {
    test("destroy should be a function", () => {
      expect(typeof voteInfo.destroy).toBe("function")
    })
  })

  describe("test getVotedCount", () => {
    beforeEach(() => {
      sandbox.restore();
      voteInfo.destroy();
    });

    test("getVotedCount should be a function", () => {
      expect(typeof voteInfo.getVotedCount).toBe("function")
    })

    test("getVotedCount should be called and only be once if success when the account is voter", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getVotedCount");
      stub2.onCall(0).resolves(1);
      stub2.onCall(1).resolves(2);
      const spy = sandbox.spy(multisigContractInstance, "init");
      const spy1 = sandbox.spy(tpInfo, "getAddress");
      const spy2 = sandbox.spy(MultisigContract.prototype, "getMyVotedCount");
      let votedCount = await voteInfo.getVotedCount(true);
      expect(votedCount).toBe(1);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly()).toBe(true);
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      expect(spy1.calledOnce).toBe(false);
      expect(spy2.calledOnce).toBe(false);
      votedCount = await voteInfo.getVotedCount(true);
      expect(votedCount).toBe(1);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(spy.calledOnce).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      voteInfo.destroy();
      votedCount = await voteInfo.getVotedCount(true);
      expect(votedCount).toBe(2);
      expect(stub1.calledTwice).toBe(true);
      expect(stub2.calledTwice).toBe(true);
      expect(spy.calledTwice).toBe(true);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
    })

    test("getMyVotedCount should be called and only be once if success when the account is not voter", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(tpInfo, "getAddress");
      stub2.resolves(config.testAddress);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getMyVotedCount");
      stub3.onCall(0).resolves(2);
      stub3.onCall(1).resolves(3);
      const spy = sandbox.spy(multisigContractInstance, "init");
      const spy1 = sandbox.spy(MultisigContract.prototype, "getVotedCount");
      let votedCount = await voteInfo.getVotedCount(false);
      expect(votedCount).toBe(2);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly()).toBe(true);
      expect(stub3.calledOnceWithExactly(config.testAddress)).toBe(true);
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      expect(spy1.called).toBe(false);
      votedCount = await voteInfo.getVotedCount(false);
      expect(votedCount).toBe(2);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(stub3.calledOnce).toBe(true);
      expect(spy.calledOnce).toBe(true);
      expect(spy1.called).toBe(false);
      voteInfo.destroy();
      votedCount = await voteInfo.getVotedCount(false);
      expect(votedCount).toBe(3);
      expect(stub1.calledTwice).toBe(true);
      expect(stub2.calledTwice).toBe(true);
      expect(stub3.calledTwice).toBe(true);
      expect(spy.calledTwice).toBe(true);
      expect(spy1.called).toBe(false);
    })

    test("return 0 if get fail", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getVotedCount");
      stub2.rejects();
      let votedCount = await voteInfo.getVotedCount(true);
      expect(votedCount).toBe(0);
    })
  })

  describe("test getPassPercent", () => {
    beforeEach(() => {
      sandbox.restore();
      voteInfo.destroy();
    });

    test("getPassPercent should be a function", () => {
      expect(typeof voteInfo.getPassPercent).toBe("function")
    })

    test("getPercent should be called and only be once if success", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getPercent");
      stub2.onCall(0).resolves(1);
      stub2.onCall(1).resolves(2);
      const spy = sandbox.spy(multisigContractInstance, "init");
      let percent = await voteInfo.getPassPercent();
      expect(percent).toBe(1);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly()).toBe(true);
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      percent = await voteInfo.getPassPercent();
      expect(percent).toBe(1);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(spy.calledOnce).toBe(true);
      voteInfo.destroy();
      percent = await voteInfo.getPassPercent();
      expect(percent).toBe(2);
      expect(stub1.calledTwice).toBe(true);
      expect(stub2.calledTwice).toBe(true);
      expect(spy.calledTwice).toBe(true);
    })

    test("return 0 if get fail", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getPercent");
      stub2.rejects();
      let votedCount = await voteInfo.getPassPercent();
      expect(votedCount).toBe(0);
    })
  })
})