"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getAvailableTransferTokens } from "@/lib/coins/main"
import Image from "next/image"
import { useSwapCurrency } from "../provider/currency-select-provider"
import { ChevronDown } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { queryFeedAddress } from "@/lib/price/get-feed-address"
import { getChainIdFromBlockchainName, getPrice } from "@/lib/price/data-feed"
import { useDataFeed } from "../provider/data-feed-provider"

interface CurrencySelectProps extends React.HTMLAttributes<HTMLDivElement> {
}

const tokens = getAvailableTransferTokens()
export function CurrencySelect({ }: CurrencySelectProps) {
    const { fromCurrency, toCurrency, setFromCurrency } = useSwapCurrency()
    const { updatePrice } = useDataFeed()

    const handleOnClick = async (key: string) => {
        setFromCurrency(key)
        console.log("Updating Data Feed", key, toCurrency)
        await updatePrice(key, toCurrency)
    }

    return <Dialog>
        <DialogTrigger className={cn(buttonVariants({ variant: "ghost" }), "bg-grayscale-025 flex items-center space-x-1")}>
            {tokens[fromCurrency] && <div className="flex items-center space-x-2">
                <Image src={tokens[fromCurrency].image} alt={fromCurrency} width={24} height={24} />
                <div>
                    {tokens[fromCurrency].name}
                </div>
            </div>}

            <ChevronDown />
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Transfer</DialogTitle>
            </DialogHeader>
            {Object.entries(tokens).map(([key, value]) =>
                <div key={key} className="flex items-center space-x-4"
                    onClick={() => handleOnClick(key)}>
                    <Image src={value.image} alt={key} width={24} height={24} />
                    {value.name}
                </div>
            )}
        </DialogContent>
    </Dialog>
}