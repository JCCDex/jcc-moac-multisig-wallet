import tpInfo from "@/js/tp";
import tp from "tp-js-sdk";
import sinon from "sinon";
import config from "@/test/unit/config";
import accountInfo from "@/js/account";
import votingProposalCache from "@/js/votingProposalCache";
import { MultisigContract } from "@/js/contract";

const sandbox = sinon.createSandbox();

describe("test votingProposalCache.ts", () => {

  describe("test clear", () => {
    test("clear should be a function", () => {
      expect(typeof votingProposalCache.clear).toBe("function")
    })
  })

  describe("test update", () => {

    afterEach(() => {
      sandbox.restore();
      votingProposalCache.clear();
    });

    test("updated proposals", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.rejects();
      let proposals = await votingProposalCache.get(true);
      expect(proposals).toBe(null);
      votingProposalCache.update([]);
      proposals = await votingProposalCache.get(true);
      expect(proposals).toEqual([]);
    })

  })

  describe("test hasCache", () => {

    afterEach(() => {
      votingProposalCache.clear();
    });

    test("return true if proposals isn't null", () => {
      votingProposalCache.update([]);
      expect(votingProposalCache.hasCache()).toBe(true);
    })

    test("return false if proposals is null", () => {
      expect(votingProposalCache.hasCache()).toBe(false);
    })

  })


  describe("test get", () => {

    afterEach(() => {
      sandbox.restore();
      votingProposalCache.clear();
    });

    test("get from cache and cache isn't null", async () => {
      votingProposalCache.update([]);
      const proposals = await votingProposalCache.get()
      expect(proposals).toEqual([]);
    });

    test("get from cache and cache is null", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.rejects();
      const proposals = await votingProposalCache.get()
      expect(proposals).toBe(null);
    });

    test("if account is voter", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.resolves(true);
      const stub1 = sandbox.stub(tpInfo, "getAddress");
      stub1.resolves(config.testAddress);
      const stub2 = sandbox.stub(tpInfo, "getNode");
      stub2.resolves(config.testNode);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getAllVotingTopicIds");
      stub3.resolves(["1", "2", "3", "4"]);
      const stub4 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub4.onCall(0).resolves({ topicId: "2", yesCount: 1 });
      stub4.onCall(1).resolves({ topicId: "3" });
      stub4.onCall(2).resolves({ topicId: "4" });
      const spy = sandbox.spy(MultisigContract.prototype, "getAllMyVotingTopicIds");
      votingProposalCache.update([
        { topicId: "1", hadVoted: true },
        { topicId: "4", hadVoted: false }
      ]);
      const proposals = await votingProposalCache.get(false);
      expect(proposals).toEqual([
        { topicId: "1", hadVoted: true },
        { topicId: "2", yesCount: 1 },
        { topicId: "3" },
        { topicId: "4" }
      ]);
      expect(spy.called).toBe(false);
      expect(stub4.callCount).toBe(3);
      expect(stub4.args).toEqual([
        ['2'],
        ['3'],
        ['4']
      ]);
    })

    test("if account isn't voter", async () => {
      const stub = sandbox.stub(accountInfo, "isVoter");
      stub.resolves(false);
      const stub1 = sandbox.stub(tpInfo, "getAddress");
      stub1.resolves(config.testAddress);
      const stub2 = sandbox.stub(tpInfo, "getNode");
      stub2.resolves(config.testNode);
      const stub3 = sandbox.stub(MultisigContract.prototype, "getAllMyVotingTopicIds");
      stub3.resolves(["1", "2", "3", "4"]);
      const stub4 = sandbox.stub(MultisigContract.prototype, "getTopic");
      stub4.onCall(0).resolves({ topicId: "2", yesCount: 1 });
      stub4.onCall(1).resolves({ topicId: "3" });
      const spy = sandbox.spy(MultisigContract.prototype, "getAllVotingTopicIds");
      votingProposalCache.update([
        { topicId: "1" },
        { topicId: "4" }
      ]);
      const proposals = await votingProposalCache.get(false);
      expect(proposals).toEqual([
        { topicId: "1" },
        { topicId: "4" },
        { topicId: "2", yesCount: 1 },
        { topicId: "3" }
      ]);
      expect(spy.called).toBe(false);
      expect(stub3.calledOnceWithExactly(config.testAddress)).toBe(true);
      expect(stub4.callCount).toBe(2);
      expect(stub4.args).toEqual([
        ['2'],
        ['3']
      ]);
    })

  })




})