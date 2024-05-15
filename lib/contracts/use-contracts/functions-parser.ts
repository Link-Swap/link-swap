import { ChainID } from "@/lib/chains";
import { getClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/functions-parser";

export interface PublicContract {
    address?: `0x${string}`;
    chain?: string;
}

export class FunctionDataParserContract {
    contract: any;

    constructor({
        address = "0x47cd702b341df7d607e249f5180d8fb9e17bad32",
        chain = ChainID.ETHEREUM_SEPOLIA
    }: PublicContract) {
        this.contract = getContract({
            address,
            abi,
            client: getClient(chain),
        })
    }

    async pack(destinationChainSelector: string, receiver: string) {
        return await this.contract.read.pack([destinationChainSelector, receiver]) as BigInt;
    }

    async packAsBytes(destinationChainSelector: string, receiver: string) {
        return await this.contract.read.packAsBytes([destinationChainSelector, receiver]);
    }

    async packAsBytesMemory(destinationChainSelector: string, receiver: string) {
        return await this.contract.read.packAsBytesMemory([destinationChainSelector, receiver]);
    }
}