import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";

const votedCache = (() => {
  let proposals = null;

  const get = async (start, end) => {
    let votedProposals;
    try {
      const isVoter = await accountInfo.isVoter();
      const address = await tpInfo.getAddress();
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      let proposalIds;
      if (isVoter) {
        proposalIds = await instance.getVotedTopicIds(start, end);
      } else {
        proposalIds = await instance.getMyVotedTopicIds(address, start, end);
      }
      const props = [];
      const backups = [];
      for (const id of proposalIds) {
        const backup = proposals && proposals.find(proposal => proposal.topicId === id);
        if (backup) {
          backups.push(backup);
        } else {
          props.push(instance.getTopic(id));
        }
      }
      const results = await Promise.all(props);
      votedProposals = [...backups, ...results];
    } catch (error) {
      console.log("request proposals error: ", error);
    }
    return votedProposals;
  };

  const update = newProposals => {
    if (proposals) {
      const backups = [];
      for (const proposal of newProposals) {
        const exist = proposals.find(p => p.topicId === proposal.topicId);
        if (!exist) {
          backups.push(proposal);
        }
      }
      proposals = [...proposals, ...backups];
    } else {
      proposals = newProposals;
    }
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

export default votedCache;
