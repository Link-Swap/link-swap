import { getContract } from "viem";
import { abi } from "../abi/ierc-20";
import { getClient } from "../evm/client";

export const loadToken = async (chain: string, address: string) => {
    const client = getClient(chain);
    return getContract({
        address: address as `0x${string}`,
        abi: abi,
        client,
    })
}