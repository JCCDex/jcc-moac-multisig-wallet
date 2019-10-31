import tp from "tp-js-sdk";

const tpInfo = (() => {
  let address: string = null;
  let node: string = null;
  let isConnectedState: boolean = null;
  let system: string = null;

  const isConnected = (): boolean => {
    if (isConnectedState === null) {
      isConnectedState = tp.isConnected();
    }
    return isConnectedState;
  };

  const getAddress = async (): Promise<string> => {
    if (!isConnected()) {
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

  const getSystem = async (): Promise<string> => {
    if (!isConnected()) {
      return "android";
    }

    if (system === null) {
      try {
        const res = await tp.getAppInfo();
        if (res && res.result) {
          system = res.data.system;
        }
      } catch (error) {
        system = null;
      }
    }
    return system;
  };

  const getNode = async (): Promise<string> => {
    if (!isConnected()) {
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
    isConnectedState = null;
  };

  return {
    destroy,
    getAddress,
    getNode,
    getSystem,
    isConnected
  };
})();

export default tpInfo;
