import { ChainID } from "@/lib/chains";
import { getClient } from "@/lib/evm/client";
import { getContract, zeroAddress } from "viem";
import { abi } from "../abi/link-swap-token";

export const LSWAP_ADDRESS: Record<string, string> = {
    [ChainID.AVALANCHE_FUJI]: "0x6E91F576DEda25aD0CfE19C23aEf953c2eA59413",
    [ChainID.POLYGON_AMOY]: "0xfeB362F2148F1303ea6Bf026d32071EA295e25ac",
    [ChainID.ETHEREUM_SEPOLIA]: "0xa662f46804ab3ab3c764c81fe9c063ef811fae70",
    [ChainID.BASE_SEPOLIA]: "0x608D532b14A1070577f01288e5FF3acC5E7F4798",
    [ChainID.OPTIMISM_SEPOLIA]: "0xfeB362F2148F1303ea6Bf026d32071EA295e25ac",
    [ChainID.ARBITRUM_SEPOLIA]: "0xfeB362F2148F1303ea6Bf026d32071EA295e25ac",
    [ChainID.BNB_TESTNET]: "0xfeB362F2148F1303ea6Bf026d32071EA295e25ac",
    [ChainID.GNOSIS_CHIADO]: "0xD9F812433Dd5ce28f7b7aD7b8FF189B65127C847",
    [ChainID.CELO_ALFAJORES]: "0xD9F812433Dd5ce28f7b7aD7b8FF189B65127C847",
}
export const getLinkSwapAddress = (chain: string) => LSWAP_ADDRESS[chain] || "";

export class LinkSwapTokenContract {
    contract: any;
    client: any;
    chain: string;

    constructor({
        chain = ChainID.ETHEREUM_SEPOLIA,
        client = getClient(chain),
        address,
    }: {
        chain?: string;
        client?: any;
        address: `0x${string}`
    }) {
        this.chain = chain;
        this.client = client;
        // const address = getAddress(chain) as `0x${string}`
        this.contract = getContract({
            address,
            abi,
            client: this.client,
        })
    }

    async faucet() {
        try {
            await this.contract.simulate.faucet();
        } catch (e) {
            throw new Error("Please wait until the next faucet time.");
        }
        return await this.contract.write.faucet();
    }

    async mint(address: string, amount: string) {
        return await this.contract.write.mint([address, amount]);
    }

    async allowance(owner: string, spender: string) {
        return await this.contract.read.allowance([owner, spender]) as BigInt;
    }

    async approve(spender: string, value: string) {
        return await this.contract.write.approve([spender, value]);
    }

    async balanceOf(account: string) {
        return await this.contract.read.balanceOf([account]) as BigInt;
    }
}


export class LinkSwapToken extends LinkSwapTokenContract {
    constructor({
        chain = ChainID.ETHEREUM_SEPOLIA,
        client = getClient(chain),
    }: {
        chain?: string;
        client?: any;
    }) {
        const address = getLinkSwapAddress(chain) as `0x${string}`;
        super({ chain, client, address });
    }
}

interface TokenInfo {
    tokenAddress: string;
    tokenId: number;
}

export interface TokenInfoPlus {
    tokenAddress: string;
    tokenId: number;
    name: string;
    symbol: string;
    decimals: number;
}