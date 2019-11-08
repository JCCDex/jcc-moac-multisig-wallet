import tpInfo from "@/js/tp";
import tp from "tp-js-sdk";
import sinon from "sinon";
import config from "@/test/unit/config";
import accountInfo from "@/js/account";
import { MultisigContract } from "@/js/contract";
import votedProposalCache from "@/js/votedProposalCache";
const sandbox = sinon.createSandbox();

describe("test votedProposalCache.ts", () => {

  describe("test clear", () => {
    test("clear should be a function", () => {
      expect(typeof votedProposalCache.clear).toBe("function")
    })
  })

  describe("test hasCache", () => {

    afterEach(() => {
      votedProposalCache.clear();
    });

    test("return true if proposals isn't null", () => {
      votedProposalCache.update([]);
      expect(votedProposalCache.hasCache()).toBe(true);
    })

    test("return false if proposals is null", () => {
      expect(votedProposalCache.hasCache()).toBe(false);
    })

  })

  describe("test get", () => {

    afterEach(() => {
      sandbox.restore();
      votedProposalCache.clear();
    });

    test("return null if error", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.rejects();
      const proposals = await votedProposalCache.get(0, 1)
      expect(proposals).toBe(null);
    });

    test("if account is voter", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.resolves(true);
      const stub1 = sandbox.stub(tpInfo, "getAddress");
      stub1.resolves(config.testAddress);
      const stub2 = sandbox.stub(tpInfo, "getNode");
      stub2.resolves(config.testNode);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getVotedTopicIds");
      stub3.resolves(["1", "2", "3", "4", "5"]);
      const stub4 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub4.onCall(0).resolves({ topicId: "2" });
      stub4.onCall(1).resolves({ topicId: "5" });
      const spy = sandbox.spy(MultisigContract.prototype, "getMyVotedTopicIds");
      votedProposalCache.update([
        { topicId: "1" },
        { topicId: "4" }
      ]);
      votedProposalCache.update([
        { topicId: "1" },
        { topicId: "3" },
        { topicId: "4" }
      ]);
      const proposals = await votedProposalCache.get(0, 4);
      expect(proposals).toEqual([
        { topicId: "1" },
        { topicId: "3" },
        { topicId: "4" },
        { topicId: "2" },
        { topicId: "5" }
      ]);
      expect(stub3.calledOnceWithExactly(0, 4)).toBe(true);
      expect(spy.called).toBe(false);
      expect(stub4.callCount).toBe(2);
      expect(stub4.args).toEqual([
        ['2'],
        ['5']
      ]);
    })

    test("if account isn't voter", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.resolves(false);
      const stub1 = sandbox.stub(tpInfo, "getAddress");
      stub1.resolves(config.testAddress);
      const stub2 = sandbox.stub(tpInfo, "getNode");
      stub2.resolves(config.testNode);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getMyVotedTopicIds");
      stub3.resolves(["1", "2", "3", "4", "5"]);
      const stub4 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub4.onCall(0).resolves({ topicId: "2" });
      stub4.onCall(1).resolves({ topicId: "5" });
      const spy = sandbox.spy(MultisigContract.prototype, "getVotedTopicIds");
      votedProposalCache.update([
        { topicId: "1" },
        { topicId: "4" }
      ]);
      votedProposalCache.update([
        { topicId: "1" },
        { topicId: "3" },
        { topicId: "4" }
      ]);
      const proposals = await votedProposalCache.get(0, 4);
      expect(proposals).toEqual([
        { topicId: "1" },
        { topicId: "3" },
        { topicId: "4" },
        { topicId: "2" },
        { topicId: "5" }
      ]);
      expect(stub3.calledOnceWithExactly(config.testAddress, 0, 4)).toBe(true);
      expect(spy.called).toBe(false);
      expect(stub4.callCount).toBe(2);
      expect(stub4.args).toEqual([
        ['2'],
        ['5']
      ]);
    })

  })



})