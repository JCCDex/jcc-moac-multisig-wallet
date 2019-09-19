
import { Moac } from "jcc-moac-utils";
import MultisigContract from "./multisig";

export const multisigContractInstance = (() => {
    let inst: MultisigContract | null = null;

    const init = (contractAddress: string, node: string, mainnet: boolean): MultisigContract => {
        if (inst === null) {
            const moac = new Moac(node, mainnet);
            inst = new MultisigContract(contractAddress);
            inst.initContract(moac);
        }

        return inst;
    };

    const destroy = () => {
        inst = null;
    };

    return {
        destroy,
        init
    };
})();
