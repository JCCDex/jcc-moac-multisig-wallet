import { smartContract as SmartContract, Moac } from "jcc-moac-utils";
const abi = require("@/abi/multisig-wallet-abi");

export default class MultisigContract extends SmartContract {

    private _contractAddress: string;

    constructor(contractAddress: string) {
        super();
        this._contractAddress = contractAddress;
    }

    public initContract(moac: Moac) {
        super.init(this._contractAddress, moac, abi);
    }
}