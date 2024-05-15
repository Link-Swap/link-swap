"use client"

import { CCIPMessageParserContract } from "@/lib/contracts/use-contracts/ccip-data-parser";
import { LinkSwapTokenListContract, TokenInfoPlus } from "@/lib/contracts/use-contracts/token-list";
import { useEffect, useState } from "react"
import { Label } from "@/components/core/components/label";
import { Input } from "@/components/core/components/input";
import { Button } from "@/components/ui/button";
import { isAddress } from "viem";
import Image from "next/image";
import { getTokenIcon } from "@/lib/coins/main";
import { cn } from "@/lib/utils";
import { CopyText } from "../components/copy-text";
import { ChainSelect } from "../transfer/chain-select";
import { ChainID } from "@/lib/chains";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface CCIPDataBuilderProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function CCIPDataBuilder({ }: CCIPDataBuilderProps) {
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [selectedToken, setToken] = useState<TokenInfoPlus>({ tokenId: 0, symbol: "" } as TokenInfoPlus);

    const [parser, setParserContract] = useState<CCIPMessageParserContract>({} as CCIPMessageParserContract);
    const [tokenList, setTokenListContract] = useState<LinkSwapTokenListContract | null>({} as LinkSwapTokenListContract);

    const [payload, setPayload] = useState<string>("");
    const [tokens, setTokens] = useState<TokenInfoPlus[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>(ChainID.ETHEREUM_SEPOLIA as string);

    useEffect(() => {
        (async () => {
            const parser = new CCIPMessageParserContract({});
            setParserContract(parser);

            const tokenList = new LinkSwapTokenListContract({});
            setTokenListContract(tokenList);
            const tokens = await tokenList.getTokensWithInfo(0, 10);
            setTokens(tokens)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setTokenListContract(null);
            setTokens([])
            const tokenList = new LinkSwapTokenListContract({
                chain: selectedChain
            });

            if (!tokenList.contract) {
                console.log("Token list contract not found")
                return;
            }

            setTokenListContract(tokenList);
            const tokens = await tokenList.getTokensWithInfo(0, 10);
            setTokens(tokens)
        })()
    }, [selectedChain])

    const handlePackData = async () => {
        const value = amount * 10 ** selectedToken.decimals;
        if (BigInt(value) > BigInt(1208925819614629174706175)) {
            setPayload("Value too high. Please reduce the amount.");
            return;
        }
        const message = await parser.pack(recipient, selectedToken.tokenId, value);
        setPayload(message.toString());
    }

    const handleDisabled = () => {
        return !isAddress(recipient) || amount == 0;
    };

    const handleChainSelect = async (chain: any) => {
        setSelectedChain(chain)
    };

    return (
        <div>
            <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-6">
                    <Label message="Destination Chain" />
                    <ChainSelect handleSelect={handleChainSelect} />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <div className="my-4">
                        <Label message="Select a Token" />
                        <div className="text-sm text-grayscale-300">Token not listed above. Send us a request to add for cross chain transfer</div>
                    </div>
                    <div className="flex space-x-2">
                        {tokens.map((token) => {
                            return <HoverCard key={token.tokenId} openDelay={0}>
                                <HoverCardTrigger>
                                    <div className={cn("cursor-pointer min-h-[36px] h-[36px] px-3 text-sm rounded-xl bg-grayscale-025",
                                        "flex items-center justify-center space-x-2",
                                        selectedToken.tokenId === token.tokenId && "bg-grayscale-250"
                                    )}
                                        onClick={() => setToken(token)}>
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
                            </HoverCard>
                        })}
                        {tokens.length === 0 && <div>No TokenList for {selectedChain}</div>}
                    </div>
                </div>
            </div>

            <Label message="Recipient" className="my-8" />
            <Input type="text" onChange={(e) => setRecipient(e.target.value)} />

            <Label message="Amount" className="my-8" />
            <Input type="number" onChange={(e) => setAmount(parseFloat(e.target.value))} min={0} />

            <Button className="mt-8" onClick={handlePackData} disabled={handleDisabled()}>Send</Button>

            <div>
                <Label message="Payload" className="my-8" />
                <div className="flex items-center justify-between">
                    <div className="w-[100%] overflow-auto">{JSON.stringify([
                        recipient,
                        selectedToken.tokenId,
                        (amount * 10 ** selectedToken.decimals).toLocaleString('fullwide', { useGrouping: false })
                    ])}</div>
                </div>
            </div>
            <div>
                <Label message="Data" className="my-8" />
                {payload && <div className="flex items-center justify-between">
                    <div className="w-[100%] overflow-auto">{payload}</div>
                    <CopyText payload={payload} />
                </div>}
            </div>
        </div >
    )
}