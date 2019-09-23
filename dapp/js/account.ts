import tpInfo from "./tp";
import multisigContractInstance from "@/js/contract";

const accountInfo = (() => {
  let isVoterState: boolean = null;

  /**
   * destroy value by key
   *
   * @param {string} key
   */
  const destroy = (key: string) => {
    if (key === "isVoter") {
      isVoterState = null;
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
        console.log("request voters error: ", error);
      }
    }
    return isVoterState;
  };

  return {
    destroy,
    isVoter
  };
})();

export default accountInfo;
