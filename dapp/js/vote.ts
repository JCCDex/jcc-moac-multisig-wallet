import tpInfo from "./tp";
import multisigContractInstance from "@/js/contract";

const voteInfo = (() => {
  let votedCount: number = null;

  const destroy = () => {
    votedCount = null;
  };

  /**
   * request voted count
   * if is voter, return all voted count
   * else return voted count which be submited by me
   *
   * @returns {Promise<number>}
   */
  const getVotedCount = async (isVoter: boolean): Promise<number> => {
    if (votedCount === null) {
      const inst = multisigContractInstance.init();
      try {
        if (isVoter) {
          votedCount = await inst.getVotedCount();
        } else {
          const address = await tpInfo.getAddress();
          votedCount = await inst.getMyVotedCount(address);
        }
      } catch (error) {
        console.log("request voted count error: ", error);
      }
    }
    return votedCount || 0;
  };

  return {
    destroy,
    getVotedCount
  };
})();

export default voteInfo;
