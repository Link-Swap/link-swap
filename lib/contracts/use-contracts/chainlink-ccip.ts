import { ChainID } from "@/lib/chains";
import { getClient, getMetamaskClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/chainlink-ccip";
import { getCCIPContract } from "@/lib/price/ccip";

const getAddress = (chain: string) => {
    const data = getCCIPContract(chain);
    return data?.ccipContract || "" as `0x${string}`;
}

export class CCIPTokenTransferContract {
    contract: any;
    client: any;
    chain: string;

    constructor({
        chain = ChainID.ETHEREUM_SEPOLIA,
        client = getClient(chain),
    }: {
        chain?: string;
        client?: any;
    }) {
        this.chain = chain;
        this.client = client;
        const address = getAddress(chain) as `0x${string}`
        this.contract = getContract({
            address,
            abi,
            client: this.client,
        })
    }

    async allowListedAddress(address: string) {
        return this.contract.read.allowListedAddress([address]) as boolean
    }

    async allowlistAddress(address: string, allowed: boolean = true) {
        return this.contract.write.allowlistAddress([address, allowed]);
    }

    async allowlistedSourceChains(chain: string) {
        return this.contract.read.allowlistedSourceChains([chain]) as boolean
    }

    async allowlistSourceChain(chain: string, allowed: boolean = true) {
        return this.contract.write.allowlistSourceChain([chain, allowed]);
    }

    async allowlistedDestinationChains(chain: string) {
        return this.contract.read.allowlistedDestinationChains([chain]) as boolean
    }

    async allowlistDestinationChain(chain: string, allowed: boolean = true) {
        return this.contract.write.allowlistDestinationChain([chain, allowed]);
    }

    async allowlistedSenders(address: string) {
        return this.contract.read.allowlistedSenders([address]) as boolean
    }

    async allowlistSender(address: string, allowed: boolean = true) {
        return this.contract.write.allowlistSender([address, allowed]);
    }

    async sendMessagePayLINK(
        destinationChainSelector: string,
        receiver: string,
        text: string,
        payer: string
    ) {
        return this.contract.write.sendMessagePayLINK([destinationChainSelector, receiver, text, payer]);
    }
}
