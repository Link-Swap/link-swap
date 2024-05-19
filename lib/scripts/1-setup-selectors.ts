import { ChainID } from "../chains";
import { CCIPTokenTransferContract } from "../contracts/use-contracts/chainlink-ccip"
import { getClient } from "../evm/client";
import { getCCIPContract } from "../price/ccip";
import { getWallet, supportTestChains } from "./get-wallet";

export const setupSelectors = async (chain: string) => {
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

    console.log("Setting up chain selectors for", contract.contract.address);

    for (const chainId of supportTestChains) {
        const ccipInfo = getCCIPContract(chainId).ccip;

        if (!ccipInfo?.chainSelector) {
            console.log("No chain selector found for", chainId);
            continue;
        }

        if (chainId === chain) {
            console.log("Skipping self chain", chainId);
            continue;
        }

        console.log("Setting up chain selector for", chainId, ccipInfo.chainSelector);
        const selector = ccipInfo.chainSelector

        const isSource = await contract.allowlistedSourceChains(selector);
        console.log("isSource", isSource);
        if (!isSource) {
            const tx = await contract.allowlistSourceChain(selector, true);
            const transaction = await publicClient.waitForTransactionReceipt(
                { hash: tx }
            )
            console.log(tx);
        }

        const isDestination = await contract.allowlistedDestinationChains(selector);
        console.log("isDestination", isDestination);
        if (!isDestination) {
            const tx = await contract.allowlistDestinationChain(selector, true);
            const transaction = await publicClient.waitForTransactionReceipt(
                { hash: tx }
            )
            console.log(tx);
        }
    };

    console.log(contract);
}