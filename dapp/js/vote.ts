import tpInfo from "./tp";
import multisigContractInstance from "@/js/contract";

const voteInfo = (() => {
  let votedCount: number | null = null;
  let passPercent: number | null = null;

  const destroy = () => {
    votedCount = null;
    passPercent = null;
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
      const node = await tpInfo.getNode();
      const inst = multisigContractInstance.init(node);
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

  const getPassPercent = async (): Promise<number> => {
    if (passPercent === null) {
      const node = await tpInfo.getNode();
      const inst = multisigContractInstance.init(node);
      try {
        passPercent = await inst.getPercent();
      } catch (error) {
        console.log("request pass percent error: ", error);
      }
    }
    return passPercent || 0;
  };

  return {
    destroy,
    getVotedCount,
    getPassPercent
  };
})();

export default voteInfo;
