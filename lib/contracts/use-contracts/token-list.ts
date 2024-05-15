import { ChainID } from "@/lib/chains";
import { getClient } from "@/lib/evm/client";
import { getContract, zeroAddress } from "viem";
import { abi } from "../abi/token-list";
import { abi as IERC20 } from "@/lib/abi/ierc-20";

const getAddress = (chain: string) => {
    switch (chain) {
        case ChainID.AVALANCHE_FUJI:
            return "0xa1f384C7C4870cB9Ce83bf506029a6258F223B9b";
        case ChainID.ETHEREUM_SEPOLIA:
            // return "0xE9Ea701e7F3e85b4A724bD049Bc5305147c7A23b"; // Old
            return "0x755261cd44Bc905CaB714d349f41b10f6Fb5a40e";
        case ChainID.BASE_SEPOLIA:
            return "0xc22dDc2EFeD83D99410b9296058401B2f9A4a177";
        case ChainID.POLYGON_AMOY:
            return "0xA96Ebd09F44f1ca1B4d5897FF98eDD1EA9D90590";
        default:
            return "";
    }
}

export class LinkSwapTokenListContract {
    contract: any;
    client: any;
    chain: string;

    constructor({
        chain = ChainID.ETHEREUM_SEPOLIA
    }: {
        chain?: string;
    }) {
        this.chain = chain;
        this.client = getClient(chain);
        const address = getAddress(chain) as any;
        if (!address) {
            return;
        }
        this.contract = getContract({
            address,
            abi,
            client: this.client,
        })
    }


    async getToken(tokenId: number) {
        return await this.contract.read.getToken([tokenId]) as string;
    }

    // Very Inefficient
    async getTokenWithInfo(tokenId: number) {
        const tokenAddress = await this.contract.read.getToken([tokenId]) as string;
        if (tokenAddress === zeroAddress) {
            return {
                tokenAddress,
                tokenId,
                name: "",
                symbol: "",
                decimals: 0,
            };
        }
        const client = getClient(this.chain);
        const contract = getContract({
            address: tokenAddress as any,
            abi: IERC20,
            client: client,
        });

        const name: string = await contract.read.name() as string;
        const symbol: string = await contract.read.symbol() as string;
        const decimals: number = await contract.read.decimals() as number;
        return {
            tokenAddress,
            tokenId,
            name,
            symbol,
            decimals,
        };
    }

    async getTokens(start: number, end: number) {
        const tokens: TokenInfo[] = await this.contract.read.getTokens([start, end]) as TokenInfo[];
        return tokens.filter((token) => token.tokenAddress !== zeroAddress);
    }

    async getTokensWithInfo(start: number, end: number) {
        const tokens: TokenInfo[] = await this.getTokens(start, end);

        const client = getClient(this.chain);
        const ret: TokenInfoPlus[] = await Promise.all(tokens.map(async (token) => {
            const contract = getContract({
                address: token.tokenAddress as any,
                abi: IERC20,
                client: client,
            });

            const name: string = await contract.read.name() as string;
            const symbol: string = await contract.read.symbol() as string;
            const decimals: number = await contract.read.decimals() as number;
            return {
                ...token,
                name,
                symbol,
                decimals,
            };
        }));

        return ret
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