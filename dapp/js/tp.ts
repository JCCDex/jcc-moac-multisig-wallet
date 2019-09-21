import tp from "tp-js-sdk";

const tpInfo = (() => {
  let address: string = null;
  let isDev = process.env.NODE_ENV === "development";

  const getAddress = async (): Promise<string> => {
    if (isDev) {
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

  const destroy = () => {
    address = null;
  };

  return {
    destroy,
    getAddress
  };
})();

export default tpInfo;
