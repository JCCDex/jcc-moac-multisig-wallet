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
      for (const id of proposalIds) {
        props.push(instance.getTopic(id));
      }
      proposals = await Promise.all(props);
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
