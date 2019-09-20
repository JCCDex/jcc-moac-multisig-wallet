import tp from "tp-js-sdk";
import multisigContractInstance from "@/js/contract";

const tpInfo = (() => {
    let address: string = null;
    let isDev = process.env.NODE_ENV === "development";
    let isVoterState: boolean;

    const getAddress = async (): Promise<string> => {
        if (isDev) {
            address = process.env.MOAC_ADDRESS;
            return address;
        }

        if (address === null) {
            try {
                const res = await tp.getCurrentWallet();
                if (res && res.result) {
                    address = res.data.address
                }
            } catch (error) {
                address = null;
            }
        }
        return address;
    }

    const destroy = () => {
        address = null;
    }

    const isVoter = async (): Promise<boolean> => {
        if (isVoterState === undefined) {
            const mainnet = process.env.MAINNET === "true" ? true : false;
            const instance = multisigContractInstance.init(process.env.CONTRACT, process.env.NODE, mainnet);
            try {
                const voters = await instance.getVoters();
                const address = await getAddress();
                isVoterState = voters.includes(address);
                return isVoterState;
            } catch (error) {

            }

        }
        return isVoterState
    }

    return {
        destroy,
        isVoter,
        getAddress
    }
})();

export default tpInfo;