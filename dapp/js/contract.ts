import {
  smartContract as SmartContract,
  Moac,
  SolidityFunction
} from "jcc-moac-utils";
const abi = require("@/abi/multisig-wallet-abi");
const ethers = require("ethers");
const abiCoder = ethers.utils.defaultAbiCoder;

/**
 * hijacking `call` to return origin bytes so that we could decode it by ethers abi coder.
 * [origin code](https://github.com/MOACChain/chain3/blob/master/lib/chain3/function.js#L130)
 */
Object.defineProperty(SolidityFunction.prototype, "call", {
  get() {
    return function() {
      const outputs = this._outputTypes;
      return new Promise((resolve, reject) => {
        const args = Array.prototype.slice.call(arguments).filter(function(a) {
          return a !== undefined;
        });
        const defaultBlock = this.extractDefaultBlock(args);
        const payload = this.toPayload(args);
        this._mc.call(payload, defaultBlock, function(error, output) {
          if (error) return reject(error);
          try {
            return resolve(abiCoder.decode(outputs, output));
          } catch (error) {
            return reject(error);
          }
        });
      });
    };
  }
});

export class MultisigContract extends SmartContract {
  private _contractAddress: string;

  constructor(contractAddress: string) {
    super();
    this._contractAddress = contractAddress;
  }

  public initContract(moac: Moac) {
    super.init(this._contractAddress, moac, abi);
  }

  /**
   * request administrator of contract
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async owner(): Promise<string> {
    const output = await super.callABI("owner");
    return output[0];
  }

  // public transferAdministrator() {

  // }

  // public transferOwnership() {

  // }

  // public administrator() {

  // }

  // public configureOnce() {

  // }

  // public setStopDeposit() {

  // }

  // public getStopDeposit() {

  // }

  /**
   * request pass percent for all proposals
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getPercent(): Promise<string> {
    const output = await super.callABI("getPercent");
    return output[0].toString(10);
  }

  /**
   * request all voters
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getVoters(): Promise<string> {
    const output = await super.callABI("getVoters");
    return output[0];
  }

  /**
   * request account is voter or not
   *
   * @param {string} address
   * @returns {Promise<boolean>}
   * @memberof MultisigContract
   */
  public async isVoter(address: string): Promise<boolean> {
    const output = await super.callABI("isVoter", address);
    return output[0];
  }

  /**
   * create timestamp and topic id related
   *
   * @memberof MultisigContract
   */
  public createTopicData(): any {
    const timestamp = Date.now();
    return {
      topicId: timestamp,
      timestamp: timestamp,
      endtime: timestamp + 3 * 24 * 60 * 60 * 1000
    };
  }
  /**
   * create proposal for changing pass percent
   * @param {number} percent percent
   * @returns {Promise<string>} transaction hash
   * @memberof MultisigContract
   */
  public async createPercentProposal(percent: number): Promise<string> {
    const topicData = this.createTopicData();
    const bytes = await super.callABI(
      "createPercentProposal",
      topicData.topicId,
      topicData.timestamp,
      topicData.endtime,
      percent
    );
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "0",
      bytes,
      { gasLimit: 260000 }
    );
  }

  /**
   * create proposal for being voter
   * @param {string} voter voter address
   * @returns {Promise<string>} transaction hash
   * @memberof MultisigContract
   */
  public async createVoterProposal(voter: string): Promise<string> {
    const topicData = this.createTopicData();
    const bytes = await super.callABI(
      "createVoterProposal",
      topicData.topicId,
      topicData.timestamp,
      topicData.endtime,
      voter
    );
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "0",
      bytes,
      { gasLimit: 270000 }
    );
  }

  /**
   * create proposal for recalling voter
   * @param {string} voter voter address
   * @returns {Promise<string>} transaction hash
   * @memberof MultisigContract
   */
  public async createRecallProposal(voter: string): Promise<string> {
    const topicData = this.createTopicData();
    const bytes = await super.callABI(
      "createRecallProposal",
      topicData.topicId,
      topicData.timestamp,
      topicData.endtime,
      voter
    );
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "0",
      bytes,
      { gasLimit: 270000 }
    );
  }

  /**
   * create a withdraw proposal
   * @param {number} amount amount of withdraw
   * @returns {Promise<string>} transaction hash
   * @memberof MultisigContract
   */
  public async createWithdrawProposal(amount: number): Promise<string> {
    const topicData = this.createTopicData();
    const bytes = await super.callABI(
      "createWithdrawProposal",
      topicData.topicId,
      topicData.timestamp,
      topicData.endtime,
      amount
    );
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "" + amount,
      bytes,
      { gasLimit: 300000 }
    );
  }

  /**
   * request count of undetermined proposal
   *
   * @memberof MultisigContract
   */
  public async getVotingCount(): Promise<string> {
    const output = await super.callABI("getVotingCount");
    return output[0].toString(10);
  }

  /**
   * request count of voted proposal
   *
   * @memberof MultisigContract
   */
  public async getVotedCount(): Promise<string> {
    const output = await super.callABI("getVotedCount");
    return output[0].toString(10);
  }

  /**
   * request count of undetermined proposal that be submited by me
   *
   * @memberof MultisigContract
   */
  public async getMyVotingCount(): Promise<string> {
    const output = await super.callABI("getMyVotingCount", {
      from: process.env.MoacAddress
    });
    return output[0].toString(10);
  }

  /**
   * request count of voted proposal that be submited by me
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getMyVotedCount(): Promise<string> {
    const output = await super.callABI("getMyVotedCount", {
      from: process.env.MoacAddress
    });
    return output[0].toString(10);
  }

  /**
   * request all voting topic ids
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getAllVotingTopicIds(): Promise<string> {
    const output = await super.callABI("getAllVotingTopicIds");
    return output[0];
  }

  /**
   * request all my voting topic ids
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getAllMyVotingTopicIds(): Promise<string> {
    const output = await super.callABI("getAllMyVotingTopicIds", {
      from: process.env.MoacAddress
    });
    return output[0];
  }

  /**
   * request all voted topic ids
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getVotedTopicIds(): Promise<string> {
    const output = await super.callABI("getVotedTopicIds");
    return output[0];
  }

  /**
   * request all my voted topic ids
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getMyVotedTopicIds(): Promise<string> {
    const output = await super.callABI("getMyVotedTopicIds", {
      from: process.env.MoacAddress
    });
    return output[0];
  }

  /**
   * get topic detail by id
   * @param {number} topicId
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getTopic(topicId: number): Promise<string> {
    const output = await super.callABI("getTopic", topicId);
    return output[0];
  }

  /**
   * vote topic
   * @param {number} topicId
   * @param {boolean} confirm true or false
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async voteTopic(topicId: number, confirm: boolean): Promise<string> {
    const bytes = await super.callABI(
      "voteTopic",
      topicId,
      Date.now(),
      confirm
    );
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "0",
      bytes,
      { gasLimit: 160000 }
    );
  }

  /**
   * get vote detail id list
   * @param {number} topicId
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getDetailIdxs(topicId: number): Promise<string> {
    const output = await super.callABI("getDetailIdxs", topicId);
    return output[0];
  }

  public async getVoteDetail(topicId: number): Promise<string> {
    const output = await super.callABI("getVoteDetail", topicId);
    return output[0];
  }

  public async getVoteDetailsByTopic(topicId: number): Promise<string> {
    const output = await super.callABI("getVoteDetailsByTopic", topicId);
    return output[0];
  }

  public async haveExpire(): Promise<string> {
    const output = await super.callABI("getVoteDetailsByTopic", Date.now());
    return output[0];
  }

  public async processExpire(): Promise<string> {
    const bytes = await super.callABI("processExpire", Date.now());
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "0",
      bytes,
      { gasLimit: 2000000 }
    );
  }

  public async deposit(amount: number): Promise<string> {
    const bytes = await super.callABI("deposit");
    return this.moac.sendTransactionWithCallData(
      process.env.MoacSecret,
      process.env.MoacAddress,
      "" + amount,
      bytes,
      { gasLimit: 100000 }
    );
  }

  /**
   * request withdraw amount
   *
   * balance = depositBalance - withdrawBalance
   *
   * @param {string} address
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getBalance(address: string): Promise<string> {
    const output = await super.callABI("getBalance", address);
    return output[0].toString(10);
  }

  /**
   * request amount which had deposited
   *
   * @param {string} address
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getDepositBalance(address: string): Promise<string> {
    const output = await super.callABI("getDepositBalance", address);
    return output[0].toString(10);
  }

  /**
   * request amount which had withdrawed
   *
   * @param {string} address
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getWithdrawBalance(address: string): Promise<string> {
    const output = await super.callABI("getWithdrawBalance", address);
    return output[0].toString(10);
  }

  // public kill() {

  // }
}

const multisigContractInstance = (() => {
  let inst: MultisigContract | null = null;

  const init = (): MultisigContract => {
    if (inst === null) {
      const contractAddress = process.env.CONTRACT;
      const node = process.env.NODE;
      const mainnet = process.env.MAINNET === "true" ? true : false;
      const moac = new Moac(node, mainnet);
      moac.initChain3();
      inst = new MultisigContract(contractAddress);
      inst.initContract(moac);
    }

    return inst;
  };

  const destroy = () => {
    inst = null;
  };

  return {
    destroy,
    init
  };
})();

export default multisigContractInstance;
