import multisigContractInstance from "@/js/contract";
import tpInfo from "./tp";

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
  let res = null;
  let count = 0;
  const node = await tpInfo.getNode();
  const instance = multisigContractInstance.init(node);
  while (res === null) {
    if (count === 10) {
      break;
    }
    try {
      res = await new Promise((resolve, reject) => {
        // limiting frequency because transaction needs some time to be confirmed
        setTimeout(async () => {
          try {
            const res = await instance.moac.getTransactionReceipt(hash);
            return resolve(res);
          } catch (error) {
            return reject(error);
          }
        }, 3000);
      });
      console.log("res: ", res);
    } catch (error) {
      console.log("request receipt error: ", error);
    }
    count = count + 1;
  }
  console.log("count: ", count);
  return res;
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
