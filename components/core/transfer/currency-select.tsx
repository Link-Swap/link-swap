"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getAvailableTransferTokens, getTokenIcon } from "@/lib/coins/main"
import { ChevronDown } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSwapCurrency } from "../provider/currency-select-provider"
import { useAccount } from "wagmi"
import { useSwapChains } from "../provider/chain-select-provider"
import { LinkSwapTokenListContract, TokenInfoPlus } from "@/lib/contracts/use-contracts/token-list"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from "next/image"
import { CopyText } from "../components/copy-text"
import { useDataFeed } from "../provider/data-feed-provider"

interface CurrencySelectProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function CurrencySelect({ }: CurrencySelectProps) {
    const { toChain } = useSwapChains()
    const { setToCurrency } = useSwapCurrency()
    const { chainId } = useAccount()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [tokenListContracts, setTokenListContracts] = useState<Record<string, LinkSwapTokenListContract>>({})
    const [tokenLists, setTokenLists] = useState<Record<string, TokenInfoPlus[]>>({})

    const [selectedToken, setToken] = useState<TokenInfoPlus>({ tokenId: 0, symbol: "" } as TokenInfoPlus);
    const [tokens, setTokens] = useState<TokenInfoPlus[]>([])
    const [compatibleList, setCompatibleList] = useState<Record<string, boolean>>({})

    //#region Token List
    useEffect(() => {
        (async () => {
            setIsLoading(true)


            try {
                const fromChain = chainId?.toString() || ""

                if (!toChain || !fromChain) {
                    setIsLoading(false)
                    return;
                }

                const fromListContract = getTokenListContract(fromChain)
                const toListContract = getTokenListContract(toChain)

                const fromTokenList = await getTokenList(fromListContract)
                const toTokenList = await getTokenList(toListContract)

                // Convert to list to dict
                const fromTokenListMap: Record<string, TokenInfoPlus> = {}
                fromTokenList.forEach((token) => {
                    fromTokenListMap[token.tokenId.toString()] = token
                })

                const compatibleList: Record<string, boolean> = {}
                toTokenList.forEach((token) => {
                    if (fromTokenListMap[token.tokenId.toString()]) {
                        compatibleList[token.tokenId.toString()] = true
                    }
                })

                setTokens(toTokenList)
                setCompatibleList(compatibleList)
            } catch (e) {
                setTokens([])
                setCompatibleList({})
                console.error(e)
            }

            setIsLoading(false)
        })()
    }, [toChain, chainId])

    const getTokenListContract = (chain: string) => {
        if (tokenListContracts[chain]) {
            return tokenListContracts[chain]
        }

        const contract = new LinkSwapTokenListContract({
            chain
        })
        setTokenListContracts({
            ...tokenListContracts,
            [chain]: contract
        })

        return contract
    }

    const getTokenList = async (contract: LinkSwapTokenListContract) => {
        if (tokenLists[contract.chain]) {
            return tokenLists[contract.chain]
        }

        const data = await contract.getTokensWithInfo(0, 10);
        setTokenLists({
            ...tokenLists,
            [contract.chain]: data
        })

        return data
    }
    //#endregion

    const { updatePrice } = useDataFeed()

    const handleOnClick = async (token: TokenInfoPlus) => {
        console.log("Updating Data Feed", token.symbol, "USD")
        setToken(token)
        setToCurrency(token)

        // This will be removed. LSWAP token will mimic price of ETH.
        let baseToken = token.symbol
        if (token.symbol.toLocaleLowerCase() === "lswap") {
            baseToken = "ETH"
        }

        await updatePrice(baseToken, "USD", false)
    }

    return <Dialog>
        <DialogTrigger className={cn(buttonVariants({ variant: "ghost" }), "bg-grayscale-025 flex items-center space-x-1")}>
            {selectedToken.tokenId &&
                <Image src={getTokenIcon(selectedToken.symbol)} alt="token" width={16} height={16} />}
            {selectedToken.tokenId
                ? <div>
                    {selectedToken.symbol}
                    {compatibleList[selectedToken.tokenId.toString()]}
                </div>
                : <div>Select Token</div>}
            <ChevronDown />
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Transfer</DialogTitle>
            </DialogHeader>

            {isLoading
                ? <div>Waiting to load tokens</div>
                : <div className="flex space-x-2">
                    {tokens.map((token) => {
                        return <>
                            {compatibleList[token.tokenId.toString()] &&
                                <HoverCard key={token.tokenId} openDelay={0}>
                                    <HoverCardTrigger>
                                        <div className={cn("cursor-pointer min-h-[36px] h-[36px] px-3 text-sm rounded-xl bg-grayscale-025",
                                            "flex items-center justify-center space-x-2",
                                            selectedToken.tokenId === token.tokenId && "bg-grayscale-250",
                                            !compatibleList[token.tokenId.toString()] && "cursor-not-allowed",
                                        )}
                                            onClick={() => handleOnClick(token)}>
                                            <Image src={getTokenIcon(token.symbol)} alt="token" width={16} height={16} />
                                            <div>
                                                {token.symbol}
                                            </div>
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        {token.name}

                                        <div className="flex justify-between items-center">
                                            {token.tokenAddress.slice(0, 8)}...
                                            <CopyText payload={token.tokenAddress} />
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>}
                        </>
                    })}
                    {tokens.length === 0 && <div>No TokenList for {toChain}</div>}
                </div>}
        </DialogContent>
    </Dialog>
}