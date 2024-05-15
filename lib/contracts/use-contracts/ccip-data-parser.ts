import { ChainID } from "@/lib/chains";
import { getClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/ccip-data-parser";
import { PublicContract } from "./functions-parser";

export class CCIPMessageParserContract {
    contract: any;

    constructor({
        address = "0xb1a8ed6906bd10895ae7d96569a0310e47c85be5",
        chain = ChainID.ETHEREUM_SEPOLIA
    }: PublicContract) {
        this.contract = getContract({
            address,
            abi,
            client: getClient(chain),
        })
    }

    async unpack(message: string) {
        return await this.contract.read.parse([message]) as CCIPData;
    }

    async pack(reciever: string, tokenId: number, amount: number) {
        return await this.contract.read.pack([[
            reciever,
            tokenId,
            amount.toLocaleString('fullwide', { useGrouping: false })
        ]]) as BigInt;
    }
}

export interface CCIPData {
    reciever: string;
    tokenId: bigint;
    value: bigint;
}