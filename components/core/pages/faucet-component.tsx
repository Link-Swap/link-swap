"use client"

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LinkSwapTokenListContract, TokenInfoPlus } from "@/lib/contracts/use-contracts/token-list";
import { zeroAddress } from "viem";
import { getTokenIcon } from "@/lib/coins/main";
import { CopyText } from "@/components/core/components/copy-text";
import { Label } from "@/components/core/components/label";
import { Input } from "@/components/core/components/input";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { getMetamaskClient } from "@/lib/evm/client";
import { LinkSwapTokenContract } from "@/lib/contracts/use-contracts/link-swap-token";
import Image from "next/image";

const nullToken = { tokenId: 0, symbol: "" } as TokenInfoPlus;
const linkSwapTokens = [1, 5, 6]

export interface FaucetComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function FaucetComponent({ }: FaucetComponentProps) {
    const { address, chainId } = useAccount()

    const [tokens, setTokens] = useState<TokenInfoPlus[]>([]);
    const [selectedToken, setToken] = useState<TokenInfoPlus>(nullToken);
    const [result, setResult] = useState<string>("");

    const [isFunding, setIFunding] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setTokens([])
            setToken(nullToken)

            if (!chainId) return;

            const tokenList = new LinkSwapTokenListContract({
                chain: chainId?.toString()
            });

            const tokenAddresses = (await Promise.all(linkSwapTokens.map(async (tokenId) => {
                return await tokenList.getTokenWithInfo(tokenId) as TokenInfoPlus;
            }))).filter((token) => token.tokenAddress !== zeroAddress);

            setTokens(tokenAddresses)
        })()
    }, [chainId])

    const handleFaucet = async () => {
        const client = await getMetamaskClient();
        const token = new LinkSwapTokenContract({
            chain: chainId?.toString(),
            client: { public: client, wallet: client, },
            address: selectedToken.tokenAddress as `0x${string}`
        })

        try {
            setIFunding(true)
            setResult("Transferring...")
            const tx = await token.faucet();
            console.log("Faucet tx", tx)
            setResult(`Transferred successfully. Please wait for the transaction to be confirmed. ${tx}`)

        } catch (e) {
            console.log("Error", e)
            setResult("Failed to fund account. Please wait and try again")
        }

        setIFunding(false)
    }

    if (!address) {
        return <div>
            Please Connect to Wallet
        </div>
    }

    return <div>
        <Label message="Select a Token" className="my-8" />
        <div className="flex space-x-2">
            {tokens.map((token) => {
                return <div key={token.tokenId}
                    className={cn("cursor-pointer min-h-[36px] h-[36px] px-3 text-sm rounded-xl bg-grayscale-025",
                        "flex items-center justify-center space-x-2",
                        selectedToken.tokenId === token.tokenId && "bg-grayscale-250"
                    )}
                    onClick={() => setToken(token)}>
                    <Image src={getTokenIcon(token.symbol)} alt="token" width={16} height={16} />
                    <div>
                        {token.symbol}
                    </div>
                </div>
            })}
        </div>

        {selectedToken.tokenId !== 0 &&
            <div>
                {/* {selectedToken.name} */}
                <div className="flex justify-between items-center">
                    {selectedToken.tokenAddress}
                    <CopyText payload={selectedToken.tokenAddress} />
                </div>
            </div>}

        {address ?
            <div>
                <Label message="Wallet address" className="my-8" />
                <Input type="text" disabled={true} value={address} />
            </div>
            : <div>
                Connect to Metamask
            </div>}

        <div className="my-2">
            Result: {result}
        </div>

        <Button onClick={handleFaucet} className="my-2"
            disabled={selectedToken.tokenAddress === zeroAddress || !address || isFunding}>
            Fund Account
        </Button>
    </div>
}