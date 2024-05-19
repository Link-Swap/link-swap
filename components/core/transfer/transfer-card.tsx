"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { useSwapChains } from "../provider/chain-select-provider"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { ChainSelect } from "@/components/core/components/chain-select"
import { cn } from "@/lib/utils"
import { CurrencySelect } from "./currency-select"
import { useDataFeed } from "../provider/data-feed-provider"
import { AmountInput } from "./amount-input"
import { useAccount } from "wagmi"
import { getIconByChainId, getNetworkNameFromChainID } from "@/lib/chains"
import Image from "next/image"
import { ArrowUpLeftFromSquareIcon, ChevronRight } from "lucide-react"
import { ChainDisplay } from "../components/chain-display"

interface TransferCardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function TransferCard({
    className,
    ...props
}: TransferCardProps) {
    const { chainId } = useAccount()
    const { toChain, setToChain } = useSwapChains()
    const { latestToData } = useDataFeed()

    const handleSelect = (chain: string) => {
        setToChain(chain)
    }

    return <Card className={cn("border-none bg-grayscale-025 rounded-2xl", className)} {...props}>
        <CardHeader className="border-b m-0 p-0 px-4 py-2">
            {!chainId
                ? <div>Connect Wallet </div>
                : <div className="flex justify-between items-center">
                    <ChainDisplay chainId={chainId?.toString()} title="From" className={cn("flex gap-2 items-center text-center", buttonVariants({ variant: "ghost" }))} />
                    <ChevronRight />
                    <ChainSelect handleSelect={handleSelect} title="To" />
                </div>}
        </CardHeader>
        <CardContent className="m-0">
            <div className="flex my-4">
                <AmountInput from={false} />
                <CurrencySelect />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center my-0">
            <div>
                ${latestToData && latestToData.total && latestToData.total.toString()}
            </div>

            <div>
                @ ${latestToData && latestToData.price && latestToData.price.toString()}
            </div>

            {/* <div className="flex">
                {"~ "}
                {from && latestFromData && latestFromData.total && <div>
                    {latestFromData.total.toFixed(2)}
                </div>}

                {!from && latestToData && latestToData.total && <div>
                    {latestToData.total.toFixed(2)}
                </div>}
            </div>
            <div className="flex items-center space-x-4">
                <Wallet />
                <SwapBalance chain={chain} currency={currency} />
            </div> */}
        </CardFooter>
    </Card>
}