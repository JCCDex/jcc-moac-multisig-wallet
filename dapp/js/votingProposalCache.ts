import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";

const votingCache = (() => {
  let proposals = null;

  const get = async (cache: boolean = true) => {
    if (cache && proposals) {
      return proposals;
    }

    try {
      const isVoter = await accountInfo.isVoter();
      const address = await tpInfo.getAddress();
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      let proposalIds;
      if (isVoter) {
        // request all voting proposal count
        proposalIds = await instance.getAllVotingTopicIds();
      } else {
        // request my voting proposal count
        proposalIds = await instance.getAllMyVotingTopicIds(address);
      }
      const props = [];
      const cacheProposals = [];
      for (const id of proposalIds) {
        if (isVoter) {
          const votedProposal = proposals && proposals.find(proposal => proposal.topicId === id && proposal.hadVoted);
          if (votedProposal) {
            cacheProposals.push(votedProposal);
          } else {
            props.push(instance.getTopic(id));
          }
        } else {
          const cacheProposal = proposals && proposals.find(proposal => proposal.topicId === id);
          if (cacheProposal) {
            cacheProposals.push(cacheProposal);
          } else {
            props.push(instance.getTopic(id));
          }
        }
      }
      const votingProposals = await Promise.all(props);
      proposals = [...cacheProposals, ...votingProposals];
    } catch (error) {
      console.log("request proposals error: ", error);
    }
    return proposals;
  };

  const update = newProposals => {
    proposals = newProposals;
  };

  const clear = () => {
    proposals = null;
  };

  const hasCache = (): boolean => {
    return proposals !== null;
  };

  return {
    clear,
    get,
    hasCache,
    update
  };
})();

export default votingCache;
