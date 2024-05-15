"use client"

import { useEffect, useState } from "react"
import { getClient } from "@/lib/evm/client"
import { useAccount } from "wagmi"
import { formatEther, getContract } from "viem"
import { getTokenAddressForChain } from "@/lib/coins/main"
import { abi } from "@/lib/coins/abi"

interface SwapBalanceProps extends React.HTMLAttributes<HTMLDivElement> {
    chain: string;
    currency: string;
}

export function SwapBalance({
    chain,
    currency
}: SwapBalanceProps) {
    const account = useAccount()

    const calculateBalance = async (currency: string, chain: string) => {
        const client = await getClient(chain);

        const tokenAddress = getTokenAddressForChain(currency, chain)
        const contract = getContract({
            address: tokenAddress as `0x${string}`,
            abi: abi,
            client: client,
        })

        const balance = await contract.read.balanceOf([account.address]) as BigInt
        return balance
    }

    const [balance, setBalance] = useState<BigInt>(BigInt(0))

    useEffect(() => {
        (async () => {
            // console.log("Updating information", chain, account, currency)
            if (!account) {
                return;
            }
            const bal = await calculateBalance(currency, chain)
            setBalance(bal)
        })()
    }, [chain, account, currency])

    return <>
        {!account
            ? <>Connect to Wallet</>
            : <div className="col-span-6">{formatEther(balance as bigint)} {currency}</div>}
    </>
}