"use client"

import { Button } from "@/components/ui/button"
import { queryFeedAddress } from "@/lib/price/get-feed-address"
import { useSwapChains } from "../provider/chain-select-provider"
import { useSwapCurrency } from "../provider/currency-select-provider"
import { SwapCard } from "./swap-card"
import { PoweredBy } from "../misc/powered-by"
import { getChainIdFromBlockchainName, getPrice } from "@/lib/price/data-feed"
import { useEffect, useState } from "react"
import { FunctionBtn } from "../misc/function-btn"

interface SwapProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function Swap({
}: SwapProps) {
    const { fromChain, toChain, setFromChain, setToChain } = useSwapChains()
    const { fromCurrency, toCurrency } = useSwapCurrency()

    const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true)
    useEffect(() => {
        if (!fromChain || !toChain) {
            setIsSwapDisabled(true)
            return
        }

        if (fromChain === toChain) {
            setIsSwapDisabled(true)
            return
        }

        setIsSwapDisabled(false)

    }, [fromChain, toChain, fromCurrency, toCurrency])

    const handleTransfer = async () => {
        console.log("Transfering", fromChain, toChain, fromCurrency)
    }

    return (
        <div className="rounded-lg">
            <div className="flex flex-col space-y-2">
                <SwapCard handleSelect={setFromChain}
                    chain={fromChain}
                    currency={fromCurrency} />

                <SwapCard handleSelect={setToChain}
                    cardTitle="To"
                    showCurrency={false}
                    from={false}
                    chain={toChain}
                    currency={fromCurrency} />
            </div>

            <Button className="my-2"
                disabled={isSwapDisabled}
                onClick={handleTransfer}
            >
                Swap
            </Button>

            <FunctionBtn />

            <div className="flex justify-center items-center my-2">
                <PoweredBy />
            </div>
        </div>
    )
}