
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { ChainSelect } from "@/components/core/transfer/chain-select"
import { CurrencySelect } from "@/components/core/transfer/currency-select"
import { AmountInput } from "@/components/core/transfer/amount-input"
import { SwapBalance } from "@/components/core/transfer/swap-balance"
import { Wallet } from "lucide-react"
import { useDataFeed } from "../provider/data-feed-provider"

interface SwapCardProps extends React.HTMLAttributes<HTMLDivElement> {
    cardTitle?: string;
    showCurrency?: boolean;
    from?: boolean,
    chain: string;
    currency: string;
    handleSelect: Function;
}
export function SwapCard({
    className,
    cardTitle = "From",
    from = true,
    showCurrency = true,
    chain,
    currency,
    handleSelect,
    ...props }: SwapCardProps) {

    const { latestFromData, latestToData } = useDataFeed();

    return (
        <Card className={cn("border-none bg-grayscale-025", className)} {...props}>
            <CardHeader className="border-b m-0 p-0 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="font-bold">{cardTitle}</div>
                        <div>
                            <ChainSelect handleSelect={handleSelect} />
                        </div>
                    </div>

                    <div>
                        {showCurrency && <CurrencySelect />}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="m-0">
                <div className="flex my-4">
                    <AmountInput from={from} disabled={!from ? true : false} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex">
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
                </div>
            </CardFooter>
        </Card>
    )
}
