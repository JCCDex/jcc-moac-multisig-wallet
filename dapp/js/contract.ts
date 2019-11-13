import { smartContract as SmartContract, Moac, SolidityFunction } from "jcc-moac-utils";
import tpInfo from "./tp";
import tp from "tp-js-sdk";
import { isMainnet } from "./util";
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
      return new Promise((resolve, reject) => {
        const args = Array.prototype.slice.call(arguments).filter(function(a) {
          return a !== undefined;
        });
        const defaultBlock = this.extractDefaultBlock(args);
        const payload = this.toPayload(args);
        this._mc.call(payload, defaultBlock, function(error, output) {
          if (error) return reject(error);
          console.log("output: ", output);
          return resolve(output);
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

  // public renounceOwnership() {

  // }

  // /**
  //  * request administrator of contract
  //  *
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public owner() {
  // }

  // public transferAdministrator() {

  // }

  // public transferOwnership() {

  // }

  // public admin() {

  // }

  // public configureOnce() {

  // }

  // public setStopDeposit() {

  // }

  /**
   * reqeust state of stopping deposit
   *
   * if true, could not deposit
   * if false, could not withdraw
   *
   * @returns {Promise<boolean>}
   * @memberof MultisigContract
   */
  public async getStopDeposit(): Promise<boolean> {
    const abiItem = abi.find(item => item.name == "getStopDeposit");
    const output = await super.callABI("getStopDeposit");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0];
  }

  /**
   * request pass percent for all proposals
   *
   * @returns {Promise<number>}
   * @memberof MultisigContract
   */
  public async getPercent(): Promise<number> {
    const abiItem = abi.find(item => item.name == "getPercent");
    const output = await super.callABI("getPercent");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].toNumber();
  }

  /**
   * request all voters
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getVoters(): Promise<string[]> {
    const abiItem = abi.find(item => item.name == "getVoters");
    const output = await super.callABI("getVoters");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0];
  }

  /**
   * request account is voter or not
   *
   * @param {string} address
   * @returns {Promise<boolean>}
   * @memberof MultisigContract
   */
  public async isVoter(address: string): Promise<boolean> {
    const abiItem = abi.find(item => item.name == "isVoter");
    const output = await super.callABI("isVoter", address);
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0];
  }

  /**
   * create proposal for changing pass percent
   *
   * @param {number} topicId
   * @param {number} timestamp
   * @param {number} endtime
   * @param {number} percent
   * @returns {Promise<string>} resolve hash if success
   * @memberof MultisigContract
   */
  public async createPercentProposal(topicId: number, timestamp: number, endtime: number, percent: number): Promise<string> {
    const bytes = await super.callABI("createPercentProposal", topicId, timestamp, endtime, percent);
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 260000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 260000 });
    }
    return hash;
  }

  /**
   * create proposal for being voter
   *
   * @param {number} topicId
   * @param {number} timestamp
   * @param {number} endtime
   * @param {string} voter moac address
   * @returns {Promise<string>} resolve hash if success
   * @memberof MultisigContract
   */
  public async createVoterProposal(topicId: number, timestamp: number, endtime: number, voter: string): Promise<string> {
    const bytes = await super.callABI("createVoterProposal", topicId, timestamp, endtime, voter);
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 270000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 270000 });
    }
    return hash;
  }

  /**
   * create proposal for recalling voter
   *
   * @param {number} topicId
   * @param {number} timestamp
   * @param {number} endtime
   * @param {string} voter moac address
   * @returns {Promise<string>} resolve hash if success
   * @memberof MultisigContract
   */
  public async createRecallProposal(topicId: number, timestamp: number, endtime: number, voter: string): Promise<string> {
    const bytes = await super.callABI("createRecallProposal", topicId, timestamp, endtime, voter);
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 270000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 270000 });
    }
    return hash;
  }

  /**
   * create a withdraw proposal
   *
   * @param {number} topicId
   * @param {number} timestamp
   * @param {number} endtime
   * @param {number} amount amount of withdraw
   * @returns {Promise<string>} resolve hash if success
   * @memberof MultisigContract
   */
  public async createWithdrawProposal(topicId: number, timestamp: number, endtime: number, amount: string): Promise<string> {
    const chain3 = super.moac.getChain3();
    const bytes = await super.callABI("createWithdrawProposal", topicId, timestamp, endtime, chain3.intToHex(chain3.toSha(amount)));
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 300000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 300000 });
    }
    return hash;
  }

  /**
   * request count of all voting proposal
   *
   * @returns {Promise<number>}
   * @memberof MultisigContract
   */
  public async getVotingCount(): Promise<number> {
    const abiItem = abi.find(item => item.name == "getVotingCount");
    const output = await super.callABI("getVotingCount");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].toNumber();
  }

  /**
   * request count of all voted proposal
   *
   * @returns {Promise<number>}
   * @memberof MultisigContract
   */
  public async getVotedCount(): Promise<number> {
    const abiItem = abi.find(item => item.name == "getVotedCount");
    const output = await super.callABI("getVotedCount");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].toNumber();
  }

  /**
   * request count of voting proposal that be submited by me
   *
   * @param {string} address
   * @returns {Promise<number>}
   * @memberof MultisigContract
   */
  public async getMyVotingCount(address: string): Promise<number> {
    const abiItem = abi.find(item => item.name == "getMyVotingCount");
    const output = await super.callABI("getMyVotingCount", {
      from: address
    });
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].toNumber();
  }

  /**
   * request count of voted proposal that be submited by me
   *
   * @param {string} address
   * @returns {Promise<number>}
   * @memberof MultisigContract
   */
  public async getMyVotedCount(address: string): Promise<number> {
    const abiItem = abi.find(item => item.name == "getMyVotedCount");
    const output = await super.callABI("getMyVotedCount", {
      from: address
    });
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].toNumber();
  }

  /**
   * request all voting topic ids
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getAllVotingTopicIds(): Promise<string[]> {
    const abiItem = abi.find(item => item.name == "getAllVotingTopicIds");
    const output = await super.callABI("getAllVotingTopicIds");
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].map(value => {
      return value.toString(10);
    });
  }

  /**
   * request all my voting topic ids
   *
   * @param {string} address
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getAllMyVotingTopicIds(address: string): Promise<string[]> {
    const abiItem = abi.find(item => item.name == "getAllMyVotingTopicIds");
    const output = await super.callABI("getAllMyVotingTopicIds", {
      from: address
    });
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].map(value => {
      return value.toString(10);
    });
  }

  /**
   * request all voted topic ids
   *
   * @param {number} start
   * @param {number} end
   * @returns {Promise<string[]>}
   * @memberof MultisigContract
   */
  public async getVotedTopicIds(start: number, end: number): Promise<string[]> {
    const abiItem = abi.find(item => item.name == "getVotedTopicIds");
    const output = await super.callABI("getVotedTopicIds", start, end);
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].map(value => {
      return value.toString(10);
    });
  }

  /**
   * request all my voted topic ids
   *
   * @param {string} address
   * @param {number} start
   * @param {number} end
   * @returns {Promise<string[]>}
   * @memberof MultisigContract
   */
  public async getMyVotedTopicIds(address: string, start: number, end: number): Promise<string[]> {
    const abiItem = abi.find(item => item.name == "getMyVotedTopicIds");
    const output = await super.callABI("getMyVotedTopicIds", start, end, { from: address });
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return decodeData[0].map(value => {
      return value.toString(10);
    });
  }

  /**
   * request topic detail by id
   * @param {string} topicId
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getTopic(topicId: string): Promise<ITopic> {
    const abiItem = abi.find(item => item.name == "getTopic");
    const output = await super.callABI("getTopic", topicId);
    const decodeData = abiCoder.decode(abiItem.outputs, output)[0];
    const data: ITopic = {
      topicId: decodeData.topicId.toString(10),
      timestamp: decodeData.timestamp.toString(10),
      endtime: decodeData.endtime.toString(10),
      voteType: decodeData.voteType.toString(10),
      origin: decodeData.origin.toString(10),
      value: decodeData.value.toString(10),
      yesCount: decodeData.yesCount.toString(10),
      noCount: decodeData.noCount.toString(10),
      idx: decodeData.idx.toString(10),
      target: decodeData.target.toString(10),
      sponsor: decodeData.sponsor.toString(10),
      flag: decodeData.flag,
      voters: decodeData.voters.toString(10),
      percent: decodeData.percent.toString(10)
    };
    return data;
  }

  /**
   * vote topic
   *
   * @param {number} topicId
   * @param {number} timestamp
   * @param {boolean} confirm
   * @returns {Promise<string>} resolve hash if success
   * @memberof MultisigContract
   */
  public async voteTopic(topicId: number, timestamp: number, confirm: boolean): Promise<string> {
    const bytes = await super.callABI("voteTopic", topicId, timestamp, confirm);
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 160000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 160000 });
    }
    return hash;
  }

  /**
   * batch vote topic
   *
   * @param {string[]} topicIds
   * @param {number} timestamp
   * @param {boolean} confirm
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async batchVoteTopic(topicIds: string[], timestamp: number, confirm: boolean): Promise<string> {
    const bytes = await super.callABI("batchVoteTopic", topicIds, timestamp, confirm);
    let hash: string;
    const gasLimit = 160000 * topicIds.length;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit });
    }
    return hash;
  }

  // /**
  //  * request vote detail id list
  //  * @param {number} topicId
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async getDetailIdxs(topicId: number): Promise<string> {
  //   const abiItem = abi.find(item => item.name == "getDetailIdxs");
  //   const output = await super.callABI("getDetailIdxs", topicId);
  //   const decodeData = abiCoder.decode(abiItem.outputs, output);
  //   return decodeData[0];
  // }

  // /**
  //  * request vote by topic id
  //  *
  //  * @param {number} topicId
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async getVoteDetail(topicId: number): Promise<string> {
  //   const abiItem = abi.find(item => item.name == "getVoteDetail");
  //   const output = await super.callABI("getVoteDetail", topicId);
  //   const decodeData = abiCoder.decode(abiItem.outputs, output);
  //   return decodeData[0];
  // }

  /**
   * request vote details by topic id
   *
   * @param {number} topicId
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getVoteDetailsByTopic(topicId: number): Promise<string> {
    const abiItem = abi.find(item => item.name == "getVoteDetailsByTopic");
    const output = await super.callABI("getVoteDetailsByTopic", topicId);
    const decodeData = abiCoder.decode(abiItem.outputs, output)[0];
    return decodeData.map(data => {
      return {
        flag: data.flag,
        timestamp: data.timestamp.toString(10),
        topicId: data.topicId.toString(10),
        voter: data.voter,
        idx: data.idx.toString(10)
      };
    });
  }

  // /**
  //  * have expire
  //  *
  //  * @param {number} endtime
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async haveExpire(endtime: number): Promise<string> {
  //   const abiItem = abi.find(item => item.name == "haveExpire");
  //   const output = await super.callABI("haveExpire", endtime);
  //   const decodeData = abiCoder.decode(abiItem.outputs, output);
  //   return decodeData[0];
  // }

  // /**
  //  * process proposal
  //  *
  //  * @param {number} endtime
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async processExpire(endtime: number): Promise<string> {
  //   const bytes = await super.callABI("processExpire", endtime);
  //   let hash: string;
  //   if (!tpInfo.isConnected()) {
  //     hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, "0", bytes, { gasLimit: 2000000 });
  //   } else {
  //     hash = await this.sendTransactionByTp(process.env.CONTRACT, "0", bytes, { gasLimit: 2000000 });
  //   }
  //   return hash;
  // }

  /**
   * deposit
   *
   * @param {string} amount
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async deposit(amount: string): Promise<string> {
    const bytes = await super.callABI("deposit");
    let hash: string;
    if (!tpInfo.isConnected()) {
      hash = await super.moac.sendTransactionWithCallData(process.env.MOAC_SECRET, process.env.CONTRACT, amount, bytes, { gasLimit: 100000 });
    } else {
      hash = await this.sendTransactionByTp(process.env.CONTRACT, amount, bytes, { gasLimit: 100000 });
    }
    return hash;
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
    const abiItem = abi.find(item => item.name == "getBalance");
    const output = await super.callABI("getBalance", address);
    const decodeData = abiCoder.decode(abiItem.outputs, output);
    return super.moac.getChain3().fromSha(decodeData[0].toString(10));
  }

  // /**
  //  * request amount which had deposited
  //  *
  //  * @param {string} address
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async getDepositBalance(address: string): Promise<string> {
  //   const abiItem = abi.find(item => item.name == "getDepositBalance");
  //   const output = await super.callABI("getDepositBalance", address);
  //   const decodeData = abiCoder.decode(abiItem.outputs, output);
  //   return super.moac.getChain3().fromSha(decodeData[0].toString(10));
  // }

  // public getDepositCount() {

  // }

  // public getDepositList() {

  // }

  // /**
  //  * request amount which had withdrawed
  //  *
  //  * @param {string} address
  //  * @returns {Promise<string>}
  //  * @memberof MultisigContract
  //  */
  // public async getWithdrawBalance(address: string): Promise<string> {
  //   const abiItem = abi.find(item => item.name == "getWithdrawBalance");
  //   const output = await super.callABI("getWithdrawBalance", address);
  //   const decodeData = abiCoder.decode(abiItem.outputs, output);
  //   return super.moac.getChain3().fromSha(decodeData[0].toString(10));
  // }

  // public getWithdrawCount() {

  // }

  // public getWithdrawList() {

  // }

  // public kill() {

  // }

  /**
   * send transaction by tokenpocket javascript sdk
   *
   * this app will be published to [TokenPocket](https://www.tokenpocket.pro/)
   *
   * @private
   * @param {string} contractAddr
   * @param {string} value
   * @param {string} calldata
   * @param {ITransactionOption} [options]
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  private async sendTransactionByTp(contractAddr: string, value: string, calldata: string, options): Promise<string> {
    const sender = await tpInfo.getAddress();
    options = await super.moac.getOptions(options || {}, sender);
    const tx = super.moac.getTx(sender, contractAddr, options.nonce, options.gasLimit, options.gasPrice, value, calldata);

    let system = await tpInfo.getSystem();
    if (system === "ios") {
      // fixed value
      tx.value = super.moac.getChain3().toSha(value);

      // fixed gasLimit
      tx.gasLimit = options.gasLimit;

      // fixed gasPrice
      tx.gasPrice = options.gasPrice;
    }
    const res = await tp.signMoacTransaction(tx);
    if (res && res.result) {
      const hash = await super.moac.sendRawSignedTransaction(res.data);
      return hash;
    } else {
      throw new Error(res.msg);
    }
  }
}

const multisigContractInstance = (() => {
  let inst: MultisigContract | null = null;

  const init = (node: string): MultisigContract => {
    if (inst === null) {
      const contractAddress = process.env.CONTRACT;
      const mainnet = isMainnet();
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
