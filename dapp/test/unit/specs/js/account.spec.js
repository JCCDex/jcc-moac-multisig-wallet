import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";
import { MultisigContract } from "@/js/contract";
import sinon from "sinon";
import config from "@/test/unit/config";
const sandbox = sinon.createSandbox();

describe("test account.ts", () => {

  describe("test destroy", () => {
    test("destroy should be a function", () => {
      expect(typeof accountInfo.destroy).toBe("function")
    })
  })

  describe("test isVoter", () => {
    afterEach(() => {
      sandbox.restore();
    });

    test("isVoter should be a function", () => {
      expect(typeof accountInfo.isVoter).toBe("function");
    })

    test("isVoter should be called and only be once if success", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(tpInfo, "getAddress");
      stub2.resolves(config.testAddress);
      const stub3 = sandbox.stub(MultisigContract.prototype, "isVoter");
      stub3.resolves(true);
      const spy = sandbox.spy(multisigContractInstance, "init");
      let isVoter = await accountInfo.isVoter();
      expect(isVoter).toBe(true);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly()).toBe(true);
      expect(stub3.calledOnceWithExactly(config.testAddress)).toBe(true);
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      isVoter = await accountInfo.isVoter();
      expect(isVoter).toBe(true);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(stub3.calledOnce).toBe(true);
      expect(spy.calledOnce).toBe(true);
    })

    test("return null if request fail", async () => {
      accountInfo.destroy("isVoter");
      const stub = sandbox.stub(tpInfo, "getAddress");
      stub.rejects();
      let isVoter = await accountInfo.isVoter();
      expect(isVoter).toBe(null);
    })
  })

  describe("test getVoters", () => {
    afterEach(() => {
      sandbox.restore();
    });

    test("getVoters should be a function", () => {
      expect(typeof accountInfo.getVoters).toBe("function");
    })

    test("getVoters should be called and only be once if success", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getVoters");
      stub2.resolves([config.testAddress]);
      const spy = sandbox.spy(multisigContractInstance, "init");
      let voters = await accountInfo.getVoters();
      expect(voters).toEqual([config.testAddress]);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly()).toBe(true);
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      voters = await accountInfo.getVoters();
      expect(voters).toEqual([config.testAddress]);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(spy.calledOnce).toBe(true);
    })

    test("return null if request fail", async () => {
      accountInfo.destroy("voters");
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.rejects();
      let voters = await accountInfo.getVoters();
      expect(voters).toBe(null);
    })
  })

  describe("test hasVotingWithdrawProposal", () => {
    afterEach(() => {
      sandbox.restore();
    });

    test("hasVotingWithdrawProposal should be a function", () => {
      expect(typeof accountInfo.hasVotingWithdrawProposal).toBe("function");
    })

    test("return true: hasVotingWithdrawProposal should be called and only be once if success", async () => {
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getAllMyVotingTopicIds");
      stub2.resolves(["1", "2"]);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub3.onCall(0).resolves({ voteType: "3" });
      stub3.onCall(1).resolves({ voteType: "1" });
      const spy = sandbox.spy(multisigContractInstance, "init");
      let has = await accountInfo.hasVotingWithdrawProposal(config.testAddress);
      expect(has).toEqual(true);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly(config.testAddress)).toBe(true);
      expect(stub3.calledTwice).toBe(true);
      expect(stub3.getCall(0).args.length).toBe(1);
      expect(stub3.getCall(1).args.length).toBe(1);
      expect(stub3.getCall(0).args[0]).toBe("1");
      expect(stub3.getCall(1).args[0]).toBe("2");
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      has = await accountInfo.hasVotingWithdrawProposal(config.testAddress);
      expect(has).toEqual(true);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(stub3.calledTwice).toBe(true);
      expect(spy.calledOnce).toBe(true);
    })

    test("return false: hasVotingWithdrawProposal should be called and only be once if success", async () => {
      accountInfo.destroy("hasVotingWithdrawProposalState");
      const stub1 = sandbox.stub(tpInfo, "getNode");
      stub1.resolves(config.testNode);
      const stub2 = sandbox.stub(MultisigContract.prototype, "getAllMyVotingTopicIds");
      stub2.resolves(["1", "2"]);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub3.onCall(0).resolves({ voteType: "2" });
      stub3.onCall(1).resolves({ voteType: "1" });
      const spy = sandbox.spy(multisigContractInstance, "init");
      let has = await accountInfo.hasVotingWithdrawProposal(config.testAddress);
      expect(has).toEqual(false);
      expect(stub1.calledOnceWithExactly()).toBe(true);
      expect(stub2.calledOnceWithExactly(config.testAddress)).toBe(true);
      expect(stub3.calledTwice).toBe(true);
      expect(stub3.getCall(0).args.length).toBe(1);
      expect(stub3.getCall(1).args.length).toBe(1);
      expect(stub3.getCall(0).args[0]).toBe("1");
      expect(stub3.getCall(1).args[0]).toBe("2");
      expect(spy.calledOnceWithExactly(config.testNode)).toBe(true);
      has = await accountInfo.hasVotingWithdrawProposal(config.testAddress);
      expect(has).toEqual(false);
      expect(stub1.calledOnce).toBe(true);
      expect(stub2.calledOnce).toBe(true);
      expect(stub3.calledTwice).toBe(true);
      expect(spy.calledOnce).toBe(true);
    })

    test("return null if request fail", async () => {
      accountInfo.destroy("hasVotingWithdrawProposalState");
      const stub = sandbox.stub(tpInfo, "getNode");
      stub.resolves(config.testNode);
      const stub1 = sandbox.stub(MultisigContract.prototype, "getAllMyVotingTopicIds");
      stub1.rejects();
      let has = await accountInfo.hasVotingWithdrawProposal(config.testAddress);
      expect(has).toBe(null);
    })
  })

})