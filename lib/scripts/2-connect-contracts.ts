import { ChainID } from "../chains";
import { CCIPTokenTransferContract } from "../contracts/use-contracts/chainlink-ccip"
import { getClient } from "../evm/client";
import { getCCIPContract } from "../price/ccip";
import { getWallet, supportTestChains } from "./get-wallet";

export const connectContracts = async (chain: string) => {
    const address = getCCIPContract(chain).ccipContract as `0x${string}`;

    if (!address) {
        console.log("No address found for chain", chain)
        return;
    }

    const client = await getWallet(chain);
    const publicClient = getClient(chain);

    const contract = new CCIPTokenTransferContract({
        chain,
        client: { public: client, wallet: client }
    });

    console.log("Connecting CCIP contracts for", contract.contract.address);

    for (const chainId of supportTestChains) {
        const ccipContract = getCCIPContract(chainId).ccipContract;

        if (!ccipContract) {
            console.log("No chain selector found for", chainId);
            continue;
        }

        if (chainId === chain) {
            console.log("Skipping self chain", chainId);
            continue;
        }

        console.log("Setting up chain selector for", chainId, ccipContract);
        const selector = ccipContract

        const isSender = await contract.allowlistedSenders(selector);
        console.log("isSender", isSender);
        if (!isSender) {
            const tx = await contract.allowlistSender(selector, true);
            console.log(tx);

            const transaction = await publicClient.waitForTransactionReceipt(
                { hash: tx }
            )
        }
    };

    console.log(contract);
}