import tpInfo from "./tp";
import multisigContractInstance from "@/js/contract";

const accountInfo = (() => {
  let isVoterState: boolean = null;
  let voters: string[] = null;

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
        isVoterState = await multisigContractInstance.init().isVoter(address);
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
        voters = await multisigContractInstance.init().getVoters();
      } catch (error) {
        console.log("request voters error: ", error);
      }
    }
    return voters;
  };

  return {
    destroy,
    isVoter,
    getVoters
  };
})();

export default accountInfo;
