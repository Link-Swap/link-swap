import { ChainID } from "@/lib/chains";
import { getClient, getMetamaskClient } from "@/lib/evm/client";
import { getContract } from "viem";
import { abi } from "../abi/chainlink-functions";

const FUNCTIONS_ADDRESS: Record<string, string> = {
    [ChainID.AVALANCHE_FUJI]: "0x49c98D6f68d172AC33E68Fb9EE1cFc572424E1AF",
    [ChainID.POLYGON_AMOY]: "0x954F6444716f08Bc8E8De546AAb787adaBCD8BBE",
    [ChainID.ETHEREUM_SEPOLIA]: "",
    [ChainID.BASE_SEPOLIA]: "",
    [ChainID.OPTIMISM_SEPOLIA]: "",
    [ChainID.ARBITRUM_SEPOLIA]: "",
    [ChainID.BNB_TESTNET]: "",
}
const getAddress = (chain: string) => FUNCTIONS_ADDRESS[chain] || "";

const SUBSCRIPTION_ID: Record<string, number> = {
    [ChainID.AVALANCHE_FUJI]: 8064,
    [ChainID.POLYGON_AMOY]: 202,
}
const getSubscriptionId = (chain: string) => SUBSCRIPTION_ID[chain] || 0

const callbackGasLimit = 300_000;
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
