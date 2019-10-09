import tpInfo from "@/js/tp";
import tp from "tp-js-sdk";
import multisigContractInstance from "@/js/contract";
import { MultisigContract } from "@/js/contract";
import { smartContract as SmartContract } from "jcc-moac-utils";
import sinon from "sinon";
import config from "@/test/unit/config";
const sandbox = sinon.createSandbox();

describe("test contract.ts", () => {
  let instance;

  describe("test multisigContractInstance", () => {
    test("init should be a function", () => {
      expect(typeof multisigContractInstance.init).toBe("function");
    });

    test("destroy should be a function", () => {
      expect(typeof multisigContractInstance.destroy).toBe("function");
    });

    test("should be inited once if success and be inited again if had been destroyed", () => {
      process.env.CONTRACT = config.testAddress;
      instance = multisigContractInstance.init(config.testNode);
      expect(instance instanceof MultisigContract).toBe(true);
      let inst = multisigContractInstance.init(config.testNode);
      expect(instance).toBe(inst);
      multisigContractInstance.destroy();
      inst = multisigContractInstance.init(config.testNode);
      expect(instance).not.toBe(inst);
    })
  })

  describe("test getStopDeposit", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const state = await instance.getStopDeposit();
      expect(state).toBe(true);
      expect(spy.calledOnceWithExactly("getStopDeposit")).toBe(true);
    })
  })

  describe("test getPercent", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000032")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const percent = await instance.getPercent();
      expect(percent).toBe(50);
      expect(spy.calledOnceWithExactly("getPercent")).toBe(true);
    })
  })

  describe("test getVoters", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000780d9da80c427defd49d458b365e0e77808f50860000000000000000000000006afc5acd3f1db92e18094e1f6b8a878b27665f51000000000000000000000000f0fb6874e0da30c8108d3de55c1fec00f82faba2000000000000000000000000329a1891fba80498525e70d285d39d8091add46e00000000000000000000000060e78bd0f249125d5c266b5e3ca8ff73da0e7ef6")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const voters = await instance.getVoters();
      expect(voters).toEqual([
        "0x780D9dA80c427DEfD49D458B365E0e77808f5086",
        "0x6AfC5ACd3F1DB92e18094E1f6b8a878B27665f51",
        "0xf0Fb6874e0da30C8108d3de55C1Fec00f82faBa2",
        "0x329A1891fBa80498525e70D285d39D8091aDd46E",
        "0x60E78bD0f249125d5c266B5e3ca8ff73da0e7Ef6"
      ]);
      expect(spy.calledOnceWithExactly("getVoters")).toBe(true);
    })

    test("if request fail", async () => {
      try {
        const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
        stub.yields(new Error("could not connect to node"), null);
        await instance.getVoters();
      } catch (error) {
        expect(error.message).toBe("could not connect to node");
      }
    })
  })

  describe("test isVoter", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const isVoter = await instance.isVoter(config.testAddress);
      expect(isVoter).toBe(true);
      expect(spy.calledOnceWithExactly("isVoter", config.testAddress)).toBe(true);
    })
  })

  describe("test createPercentProposal", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.createPercentProposal("1570519453119", "1570519453119", "1570778653119", 80);
      expect(spy.calledOnceWithExactly("createPercentProposal", "1570519453119", "1570519453119", "1570778653119", 80)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0x419963b50000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000000000000000000000000000000000000000000050", { gasLimit: 260000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.createPercentProposal("1570519453119", "1570519453119", "1570778653119", 80);
      expect(spy.calledOnceWithExactly("createPercentProposal", "1570519453119", "1570519453119", "1570778653119", 80)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0x419963b50000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000000000000000000000000000000000000000000050", { gasLimit: 260000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test createVoterProposal", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.createVoterProposal("1570519453119", "1570519453119", "1570778653119", config.testAddress);
      expect(spy.calledOnceWithExactly("createVoterProposal", "1570519453119", "1570519453119", "1570778653119", config.testAddress)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0x6c58ee910000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f60", { gasLimit: 270000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.createVoterProposal("1570519453119", "1570519453119", "1570778653119", config.testAddress);
      expect(spy.calledOnceWithExactly("createVoterProposal", "1570519453119", "1570519453119", "1570778653119", config.testAddress)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0x6c58ee910000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f60", { gasLimit: 270000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test createRecallProposal", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.createRecallProposal("1570519453119", "1570519453119", "1570778653119", config.testAddress);
      expect(spy.calledOnceWithExactly("createRecallProposal", "1570519453119", "1570519453119", "1570778653119", config.testAddress)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0xf014bbeb0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f60", { gasLimit: 270000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.createRecallProposal("1570519453119", "1570519453119", "1570778653119", config.testAddress);
      expect(spy.calledOnceWithExactly("createRecallProposal", "1570519453119", "1570519453119", "1570778653119", config.testAddress)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0xf014bbeb0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f60", { gasLimit: 270000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test createWithdrawProposal", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.createWithdrawProposal("1570519453119", "1570519453119", "1570778653119", "1");
      expect(spy.calledOnceWithExactly("createWithdrawProposal", "1570519453119", "1570519453119", "1570778653119", "0xde0b6b3a7640000")).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0x69f9b5920000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000000000000000000000000000000de0b6b3a7640000", { gasLimit: 300000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.createWithdrawProposal("1570519453119", "1570519453119", "1570778653119", "1");
      expect(spy.calledOnceWithExactly("createWithdrawProposal", "1570519453119", "1570519453119", "1570778653119", "0xde0b6b3a7640000")).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0x69f9b5920000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf0000000000000000000000000000000000000000000000000de0b6b3a7640000", { gasLimit: 300000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test getVotingCount", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const count = await instance.getVotingCount();
      expect(count).toEqual(1);
      expect(spy.calledOnceWithExactly("getVotingCount")).toBe(true);
    })
  })

  describe("test getVotedCount", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const count = await instance.getVotedCount();
      expect(count).toEqual(1);
      expect(spy.calledOnceWithExactly("getVotedCount")).toBe(true);
    })
  })

  describe("test getMyVotingCount", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const count = await instance.getMyVotingCount(config.testAddress);
      expect(count).toEqual(1);
      const params = spy.args[0];
      expect(params[0]).toBe("getMyVotingCount");
      expect(params[1].from).toBe(config.testAddress);
    })
  })

  describe("test getMyVotedCount", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000000000000001")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const count = await instance.getMyVotedCount(config.testAddress);
      expect(count).toEqual(1);
      const params = spy.args[0];
      expect(params[0]).toBe("getMyVotedCount");
      expect(params[1].from).toBe(config.testAddress);
    })
  })

  describe("test getAllVotingTopicIds", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const ids = await instance.getAllVotingTopicIds();
      expect(ids).toEqual(["1570519453119"]);
      expect(spy.calledOnceWithExactly("getAllVotingTopicIds")).toBe(true);
    })
  })

  describe("test getAllMyVotingTopicIds", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const ids = await instance.getAllMyVotingTopicIds(config.testAddress);
      expect(ids).toEqual(["1570519453119"]);
      const params = spy.args[0];
      expect(params[0]).toBe("getAllMyVotingTopicIds");
      expect(params[1].from).toBe(config.testAddress);
    })
  })

  describe("test getVotedTopicIds", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const ids = await instance.getVotedTopicIds(0, 1);
      expect(ids).toEqual(["1570519453119"]);
      expect(spy.calledOnceWithExactly("getVotedTopicIds", 0, 1)).toBe(true);
    })
  })

  describe("test getMyVotedTopicIds", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const ids = await instance.getMyVotedTopicIds(config.testAddress, 0, 1);
      expect(ids).toEqual(["1570519453119"]);
      const params = spy.args[0];
      expect(params[0]).toBe("getMyVotedTopicIds");
      expect(params[1]).toBe(0);
      expect(params[2]).toBe(1);
      expect(params[3].from).toBe(config.testAddress);
    })
  })

  describe("test getTopic", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016db9b421bf000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f600000000000000000000000005edccedfe9952f5b828937b325bd1f132aa09f600000000000000000000000000000000000000000000000000000000000000000")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const topic = await instance.getTopic(1570519453119);
      expect(topic).toEqual({ "endtime": "1570778653119", "flag": false, "idx": "0", "noCount": "1", "origin": "0", "sponsor": "0x5EDcceDfe9952F5b828937b325Bd1F132aa09F60", "target": "0x5EDcceDfe9952F5b828937b325Bd1F132aa09F60", "timestamp": "1570519453119", "topicId": "1570519453119", "value": "1000000000000000000", "voteType": "3", "yesCount": "0" });
      expect(spy.calledOnceWithExactly("getTopic", 1570519453119)).toBe(true);
    })
  })

  describe("test voteTopic", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.voteTopic("1570519453119", "1570519453119", false);
      expect(spy.calledOnceWithExactly("voteTopic", "1570519453119", "1570519453119", false)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0xe589c3610000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000000000000000", { gasLimit: 160000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.voteTopic("1570519453119", "1570519453119", true);
      expect(spy.calledOnceWithExactly("voteTopic", "1570519453119", "1570519453119", true)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0xe589c3610000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000000000000001", { gasLimit: 160000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test batchVoteTopic", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.batchVoteTopic(["1570519453119"], "1570519453119", false);
      expect(spy.calledOnceWithExactly("batchVoteTopic", ["1570519453119"], "1570519453119", false)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "0", "0x75b54de100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000016daa410dbf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf", { gasLimit: 300000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.batchVoteTopic(["1570519453119"], "1570519453119", true);
      expect(spy.calledOnceWithExactly("batchVoteTopic", ["1570519453119"], "1570519453119", true)).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "0", "0x75b54de100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000016daa410dbf000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf", { gasLimit: 300000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test getVoteDetailsByTopic", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000016daa410dbf0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000780d9da80c427defd49d458b365e0e77808f50860000000000000000000000000000000000000000000000000000000000000000")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const voteDetails = await instance.getVoteDetailsByTopic(1570519453119);
      expect(voteDetails).toEqual([{ "flag": false, "idx": "0", "timestamp": "1570519453119", "topicId": "1570519453119", "voter": "0x780D9dA80c427DEfD49D458B365E0e77808f5086" }]);
      expect(spy.calledOnceWithExactly("getVoteDetailsByTopic", 1570519453119)).toBe(true);
    })
  })

  describe("test deposit", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("sendTransactionWithCallData should be called when the enviroment is development", async () => {
      process.env.NODE_ENV = "development";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(instance.moac, "sendTransactionWithCallData");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(MultisigContract.prototype, "sendTransactionByTp");
      const hash = await instance.deposit("1");
      expect(spy.calledOnceWithExactly("deposit")).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testSecret, config.testContract, "1", "0xd0e30db0", { gasLimit: 100000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })

    test("sendTransactionByTp should be called when the enviroment is production", async () => {
      process.env.NODE_ENV = "production";
      process.env.MOAC_SECRET = config.testSecret;
      process.env.CONTRACT = config.testContract;
      const stub = sandbox.stub(MultisigContract.prototype, "sendTransactionByTp");
      stub.resolves(config.testHash);
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const spy1 = sandbox.spy(instance.moac, "sendTransactionWithCallData");
      const hash = await instance.deposit("1");
      expect(spy.calledOnceWithExactly("deposit")).toBe(true);
      expect(spy1.called).toBe(false);
      expect(stub.calledOnceWithExactly(config.testContract, "1", "0xd0e30db0", { gasLimit: 100000 })).toBe(true);
      expect(hash).toBe(config.testHash);
    })
  })

  describe("test getBalance", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(instance.moac.getChain3().mc, "call");
      stub.yields(null, "0x0000000000000000000000000000000000000000000000001bc16d674ec80000")
      const spy = sandbox.spy(SmartContract.prototype, "callABI");
      const balance = await instance.getBalance(config.testAddress);
      expect(balance).toBe("2");
      expect(spy.calledOnceWithExactly("getBalance", config.testAddress)).toBe(true);
    })
  })

  describe("test sendTransactionByTp", () => {

    afterEach(() => {
      sandbox.restore();
    });

    test("if request success", async () => {
      const stub = sandbox.stub(tpInfo, "getAddress");
      stub.resolves(config.testAddress);
      const stub1 = sandbox.stub(instance.moac, "getOptions");
      stub1.resolves({
        nonce: "0",
        gasLimit: "1",
        gasPrice: "2"
      })
      const stub2 = sandbox.stub(tp, "sendMoacTransaction");
      stub2.resolves({
        result: true,
        data: config.testHash
      })
      const hash = await instance.sendTransactionByTp(config.testContract, "1", "0x00");
      expect(hash).toBe(config.testHash);
      expect(stub1.calledOnceWithExactly({}, config.testAddress));
      expect(stub2.calledOnceWithExactly({
        chainId: '0x65',
        data: '0x00',
        from: '0x5edccedfe9952f5b828937b325bd1f132aa09f60',
        gasLimit: '0x1',
        gasPrice: '0x2',
        nonce: '0x0',
        shardingFlag: '0x0',
        systemContract: '0x0',
        value: '0xde0b6b3a7640000',
        via: '0x',
        to: '0x8eca41a83ea0efbd41401ed850774974bda6b697'
      })).toBe(true);
    })

    test("if request fail", async () => {
      const stub = sandbox.stub(tpInfo, "getAddress");
      stub.resolves(config.testAddress);
      const stub1 = sandbox.stub(instance.moac, "getOptions");
      stub1.resolves({
        nonce: "0",
        gasLimit: "1",
        gasPrice: "2"
      })
      const stub2 = sandbox.stub(tp, "sendMoacTransaction");
      stub2.resolves({
        result: false,
        msg: "nonce is too low"
      })
      try {
        await instance.sendTransactionByTp(config.testContract, "1", "0x00", { nonce: "2" });
      } catch (error) {
        expect(stub1.calledOnceWithExactly({ nonce: "2" }, config.testAddress));
        expect(error.message).toBe("nonce is too low")
      }
    })
  })
})