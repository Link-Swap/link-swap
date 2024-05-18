import { ChainID } from "@/lib/chains";
import { getClient, getMetamaskClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/chainlink-functions";

const getAddress = (chain: string) => {
    switch (chain) {
        case ChainID.AVALANCHE_FUJI:
            return "0x0feeff9505c18521b4e053ba4fec9cc2a387ccc0";
        case ChainID.BASE_SEPOLIA:
            return "0x6aF056A98F8E141fBa40DD89FFb74aA6e9f05355";
        case ChainID.ETHEREUM_SEPOLIA:
            return "";
        case ChainID.POLYGON_AMOY:
            return "0xC83713aF92509eb5bC4ec7647755cE559ad90d42";
        case ChainID.OPTIMISM_SEPOLIA:
            return "0xfb0Dba2816b87386fA236B224898fc91946F5ADD";
        case ChainID.ARBITRUM_SEPOLIA:
            return "0xfb0Dba2816b87386fA236B224898fc91946F5ADD";
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
        case ChainID.POLYGON_AMOY:
            return 202;
        case ChainID.OPTIMISM_SEPOLIA:
            return 186;
        case ChainID.ARBITRUM_SEPOLIA:
            return 64;
        default:
            return 0;
    }
}

const callbackGasLimit = 300_000;
// const callbackGasLimit = 400_000;

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

        const response = await fetch("/api/source");
        const source = await response.text();

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
        ],
            // {
            //     account: this.client.wallet.account.address,
            //     gas: 3_000_000
            // }
        );
    }

    async sendRequestEstimateGas(ccipData: string, destinationChain: string) {
        // const c = await getMetamaskClient();
        // const contract = getContract({
        //     address: this.contract.address,
        //     abi: this.contract.abi,
        //     client: { wallet: c },
        // })
        // contract.write.sendRequest([], {
        //     account: this.client.account.address,
        //     gas: 3_000_000
        // });
        const publicClient = getClient(this.chain);
        const args = [ccipData, destinationChain];

        const response = await fetch("/api/source");
        const source = await response.text();

        const gas = await publicClient.estimateContractGas({
            address: this.contract.address,
            abi: this.contract.abi,
            functionName: 'sendRequest',
            args: [
                source, // source
                "0x", // user hosted secrets - encryptedSecretsUrls - empFty in this example
                0, // don hosted secrets - slot ID - empty in this example
                0, // don hosted secrets - version - empty in this example
                args,
                [], // bytesArgs - arguments can be encoded off-chain to bytes.
                this.subscriptionId,
                callbackGasLimit,
            ],
            account: "0xa327f039b95703fa84d507e7338fb680d2bef447"
        })

        return gas
    }
}
