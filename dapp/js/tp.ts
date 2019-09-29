import tp from "tp-js-sdk";
import { isDev } from "./util";

const tpInfo = (() => {
  let address: string = null;
  let node: string = null;

  const getAddress = async (): Promise<string> => {
    if (isDev()) {
      address = process.env.MOAC_ADDRESS;
      return address;
    }

    if (address === null) {
      try {
        const res = await tp.getCurrentWallet();
        if (res && res.result) {
          address = res.data.address;
        }
      } catch (error) {
        address = null;
      }
    }
    return address;
  };

  const getNode = async (): Promise<string> => {
    if (isDev()) {
      node = process.env.NODE;
      return node;
    }

    if (node === null) {
      try {
        const res = await tp.getNodeUrl({ blockchain: "moac" });
        if (res && res.result) {
          node = res.data.nodeUrl;
        }
      } catch (error) {
        console.log("request default node error: ", error);
      }
    }
    return node || process.env.NODE;
  };

  const destroy = () => {
    address = null;
    node = null;
  };

  return {
    destroy,
    getAddress,
    getNode
  };
})();

export default tpInfo;
