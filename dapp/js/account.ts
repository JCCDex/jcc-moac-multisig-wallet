import tpInfo from "./tp";
import { TYPE_WITHDRAW } from "./constant";
import multisigContractInstance from "@/js/contract";

const accountInfo = (() => {
  let isVoterState: boolean = null;
  let voters: string[] = null;
  let hasVotingWithdrawProposalState: boolean = null;

  /**
   * destroy value by key
   *
   * @param {string} key
   */
  const destroy = (key: string) => {
    if (key === "isVoter") {
      isVoterState = null;
    } else if (key === "voters") {
      voters = null;
    } else if (key === "hasVotingWithdrawProposalState") {
      hasVotingWithdrawProposalState = null;
    }
  };

  /**
   * request current address is voter or not
   *
   * @returns {Promise<boolean>}
   */
  const isVoter = async (): Promise<boolean> => {
    if (isVoterState === null) {
      try {
        const address = await tpInfo.getAddress();
        const node = await tpInfo.getNode();
        isVoterState = await multisigContractInstance.init(node).isVoter(address);
      } catch (error) {
        console.log("request if is voter error: ", error);
      }
    }
    return isVoterState;
  };

  /**
   * request all voters
   *
   * @returns {Promise<string[]>}
   */
  const getVoters = async (): Promise<string[]> => {
    if (voters === null) {
      try {
        const node = await tpInfo.getNode();
        voters = await multisigContractInstance.init(node).getVoters();
      } catch (error) {
        console.log("request voters error: ", error);
      }
    }
    return voters;
  };

  /**
   * request if has voting withdraw proposal for my account
   *
   * if has, could't submit a withdraw proposal again
   *
   * @returns {Promise<boolean>}
   */
  const hasVotingWithdrawProposal = async (address: string): Promise<boolean> => {
    if (hasVotingWithdrawProposalState === null) {
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      try {
        const proposalIds = await instance.getAllMyVotingTopicIds(address);
        const props = [];
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const responses = await Promise.all(props);
        const votingWithdrawProposal = responses.find(res => res.voteType === TYPE_WITHDRAW);
        hasVotingWithdrawProposalState = Boolean(votingWithdrawProposal);
      } catch (error) {
        console.log("request voting withdrawing state error: ", error);
      }
    }
    return hasVotingWithdrawProposalState;
  };

  return {
    destroy,
    isVoter,
    getVoters,
    hasVotingWithdrawProposal
  };
})();

export default accountInfo;
