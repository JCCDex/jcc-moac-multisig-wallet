import multisigContractInstance from "@/js/contract";

/**
 * request receipt information
 *
 * because transaction to be confirmed needs some time,
 * we need request receipt information to validate transaction is successful or not
 * after creating a proposal
 *
 * @param {string} hash
 * @returns {Promise<any>}
 */
const requestReceipt = async (hash: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const instance = multisigContractInstance.init();
    // limiting frequency because transaction needs some time to be confirmed
    setTimeout(async () => {
      try {
        const res = await instance.moac.getTransactionReceipt(hash);
        return resolve(res);
      } catch (error) {
        return reject(error);
      }
    }, 2000);
  });
};

/**
 * validate transaction is succuessful or not
 *
 * @param {*} data
 * @returns {boolean} return true if status is `0x01`
 */
const isSuccessful = (data: any): boolean => {
  return Boolean(data && data.status === "0x1");
};

export { requestReceipt, isSuccessful };
