import { ChainID } from "@/lib/chains";
import { getClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/chainlink-functions";

const getAddress = (chain: string) => {
    switch (chain) {
        case ChainID.BASE_SEPOLIA:
            return "0xb1a8ED6906bD10895Ae7D96569A0310e47c85Be5";
        case ChainID.ETHEREUM_SEPOLIA:
            // return "0x3fFBab4f55755F1912370fA8f359048016368a18";
        case ChainID.AVALANCHE_FUJI:
            // return "0x55B899B762Db70B4Aa7227D95E870bD415eAa41D";
            return "0x262f7B5cA0C31cB99C0aA71E1Cd8f09c281B8C9d";
        default:
            return "";
    }
}

const getSubscriptionId = (chain: string) => {
    switch (chain) {
        case ChainID.BASE_SEPOLIA:
            return 42;
        case ChainID.ETHEREUM_SEPOLIA:
            return 2697;
        case ChainID.AVALANCHE_FUJI:
            return 8064;
        default:
            return 0;
    }
}

export class FunctionsConsumerContract {
    contract: any;
    client: any;
    chain: string;
    subscriptionId: number;

    constructor({
        chain = ChainID.ETHEREUM_SEPOLIA,
        client = getClient(chain),
    }: {
        chain?: string;
        client?: any;
    }) {
        this.chain = chain;
        this.client = client;
        this.subscriptionId = getSubscriptionId(chain);
        const address = getAddress(chain) as `0x${string}`
        this.contract = getContract({
            address,
            abi,
            client: this.client,
        })
    }

    async sendRequest(ccipData: string, destinationChain: string) {
        const args = [ccipData, destinationChain];
        const callbackGasLimit = 300_000;

        const response = await fetch("/api/source");
        const source = await response.text();
        console.log(source);

        console.log("Sending request to Chainlink node", ccipData, destinationChain);
        return await this.contract.write.sendRequest([
            source, // source
            "0x", // user hosted secrets - encryptedSecretsUrls - empFty in this example
            0, // don hosted secrets - slot ID - empty in this example
            0, // don hosted secrets - version - empty in this example
            args,
            [], // bytesArgs - arguments can be encoded off-chain to bytes.
            this.subscriptionId,
            callbackGasLimit,
        ]);
    }
}
