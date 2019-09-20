import {
  smartContract as SmartContract,
  Moac,
  SolidityFunction
} from "jcc-moac-utils";
const abi = require("@/abi/multisig-wallet-abi");
const abiCoder = require("ethers/utils/abi-coder").defaultAbiCoder;

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

  /**
   * request administrator of contract
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async owner(): Promise<string> {
    const bytes = await super.callABI("owner");
    const outputs = abi.find(item => item.name === "owner").outputs;
    const owner = abiCoder.decode(outputs, bytes)[0];
    return owner;
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
    const bytes = await super.callABI("getPercent");
    const outputs = abi.find(item => item.name === "getPercent").outputs;
    const percent = abiCoder.decode(outputs, bytes)[0];
    return percent.toString(10);
  }

  /**
   * request all voters
   *
   * @returns {Promise<string>}
   * @memberof MultisigContract
   */
  public async getVoters(): Promise<string> {
    const bytes = await super.callABI("getVoters");
    const outputs = abi.find(item => item.name === "getVoters").outputs;
    const voters = abiCoder.decode(outputs, bytes)[0];
    return voters;
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
    const bytes = await super.callABI("getVotingCount");
    const outputs = abi.find(item => item.name === "getVotingCount").outputs;
    const count = abiCoder.decode(outputs, bytes)[0];
    return count.toString(10);
  }

  /**
   * request count of undetermined proposal
   *
   * @memberof MultisigContract
   */
  public async getVotedCount(): Promise<string> {
    const bytes = await super.callABI("getVotedCount");
    const outputs = abi.find(item => item.name === "getVotedCount").outputs;
    const count = abiCoder.decode(outputs, bytes)[0];
    return count.toString(10);
  }

  public getAllVotingTopicIds() {}

  public getTopic() {}

  public voteTopic() {}

  public getDetailIdxs() {}

  public getVoteDetail() {}

  public getVoteDetailsByTopic() {}

  public haveExpire() {}

  public processExpire() {}

  public deposit() {}

  public getBalance() {}

  public getDepositBalance() {}

  public getWithdrawBalance() {}

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
