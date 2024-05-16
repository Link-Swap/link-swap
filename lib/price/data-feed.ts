import { getContract } from "viem"
import { abi } from "./abi"
import { getClient } from "../evm/client"
import { ChainID } from "../chains";

export interface RoundInfo {
    roundId: BigInt;
    answer: BigInt;
    startedAt: BigInt;
    updatedAt: BigInt;
    answeredInRound: BigInt;

    // customised to help format
    decimals: BigInt;
}

export const getPrice = async (
    address: `0x${string}` = "0xF13148424cc6fDfa793eAe323B081c130fF839F1",
    chain: string = ChainID.FANTOM_MAINNET
) => {
    const client = getClient(chain);
    const contract = getContract({
        address: address,
        abi: abi,
        client,
    })

    console.log("Getting price", contract)
    const rating = await contract.read.latestRoundData()
    const decimals = await contract.read.decimals()

    return toType(rating, decimals)
}

const toType = (value: any, decimals: any): RoundInfo => {
    if (value === null) return {
        roundId: BigInt(0),
        answer: BigInt(0),
        startedAt: BigInt(0),
        updatedAt: BigInt(0),
        answeredInRound: BigInt(0),
        decimals: BigInt(0)
    }

    return {
        roundId: BigInt(value[0]),
        answer: BigInt(value[1]),
        startedAt: BigInt(value[2]),
        updatedAt: BigInt(value[3]),
        answeredInRound: BigInt(value[4]),
        decimals: BigInt(decimals)
    }
}

export const getChainIdFromBlockchainName = (name: string): string => {
    switch (name) {
        case "Ethereum":
            return ChainID.ETHEREUM_MAINNET
        case "Polygon":
        case "Matic":
            return ChainID.POLYGON_MAINNET
        case "Fantom":
            return ChainID.FANTOM_MAINNET
        case "Avalanche":
            return ChainID.AVALANCHE_MAINNET
        default:
            return ChainID.ETHEREUM_MAINNET
    }
}