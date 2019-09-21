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
   * create proposal for changing pass percent
   *
   * @memberof MultisigContract
   */
  public createPercentProposal() {}

  /**
   * create proposal for being voter
   *
   * @memberof MultisigContract
   */
  public createVoterProposal() {}

  /**
   * create proposal for recalling voter
   *
   * @memberof MultisigContract
   */
  public createRecallProposal() {}

  /**
   * create a withdraw proposal
   *
   * @memberof MultisigContract
   */
  public createWithdrawProposal() {}

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
    const output = await super.callABI("getMyVotingCount");
    return output[0].toString(10);
  }

  /**
   * request count of voted proposal that be submited by me
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getMyVotedCount(): Promise<string> {
    const output = await super.callABI("getMyVotedCount");
    return output[0].toString(10);
  }

  public getAllVotingTopicIds() {}

  public getAllMyVotingTopicIds() {}

  public getVotedTopicIds() {}

  public getMyVotedTopicIds() {}

  public getTopic() {}

  public voteTopic() {}

  public getDetailIdxs() {}

  public getVoteDetail() {}

  public getVoteDetailsByTopic() {}

  public haveExpire() {}

  public processExpire() {}

  public deposit() {}

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
