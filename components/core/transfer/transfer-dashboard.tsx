"use client"

import { Button } from "@/components/ui/button"
import { useSwapChains } from "@/components/core/provider/chain-select-provider"
import { useSwapCurrency } from "@/components/core/provider/currency-select-provider"
import { PoweredBy } from "@/components/core/components/powered-by"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getNetworkNameFromChainID } from "@/lib/chains"
import { TransferCard } from "./transfer-card"
import { LinkSwapTokenListContract } from "@/lib/contracts/use-contracts/token-list"
import { LinkSwapTokenContract } from "@/lib/contracts/use-contracts/link-swap-token"
import { getMetamaskClient } from "@/lib/evm/client"
import { Label } from "../components/label"
import { Input } from "../components/input"
import { isAddress } from "viem"
import { getCCIPContract } from "@/lib/price/ccip"
import { useToast } from "@/components/ui/use-toast"
import { FunctionsConsumerContract } from "@/lib/contracts/use-contracts/chainlink-functions"
import { CCIPMessageParserContract } from "@/lib/contracts/use-contracts/ccip-data-parser"

interface TransferDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function TransferDashboard({
}: TransferDashboardProps) {
    const { toast } = useToast()
    const { address, chainId } = useAccount()

    const { toChain } = useSwapChains()
    const { toCurrency, toValue } = useSwapCurrency()

    const [receiver, setReceiver] = useState<string>("")
    const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(false)
    const [btnText, setBtnText] = useState<string>("")

    useEffect(() => {
        if (address)
            setReceiver(address)
    }, [])

    const handleTransfer = async () => {
        try {
            setIsSwapDisabled(true)
            setBtnText("Validating funds...")

            await doTransfer()
        } catch (error: any) {
            console.error(error)
            toast({
                title: "Error",
                description: error.toString(),
            })
        } finally {
            setIsSwapDisabled(false)
            setBtnText("Transfer")
        }
    }

    const doTransfer = async () => {
        console.log("Transfering", chainId?.toString(), toChain, toValue, toCurrency)
        const fromChain = chainId?.toString() || "";

        //#region Basic Validation
        if (!address) {
            throw new Error("Make sure to login")
        }
        if (toValue <= 0) {
            throw new Error("Invalid Value")
        }
        if (!toCurrency) {
            throw new Error("Unknown Currency")
        }
        if (!isAddress(receiver)) {
            throw new Error("Make sure to add valid reciever")
        }
        if (fromChain === toChain) {
            throw new Error("Cannot transfer to the same chain")
        }
        //#endregion

        //#region Get CCIP and Token Contract
        const ccipAddress = getCCIPContract(fromChain)
        if (!ccipAddress.ccipContract) {
            console.error("Chain Not Supported")
            return
        }

        const contract = new LinkSwapTokenListContract({
            chain: fromChain
        })
        const fromToken = await contract.getTokenWithInfo(toCurrency.tokenId);
        console.log(fromToken);

        const client = await getMetamaskClient();
        const fromTokenContract = new LinkSwapTokenContract({
            chain: fromChain,
            client: { public: client, wallet: client },
            address: fromToken.tokenAddress as `0x${string}`,
        })
        //#endregion

        //#region Check if user has enough balance
        const value = toValue * 10 ** fromToken.decimals;
        const valueBigInt = BigInt(value)
        const userBalance = await fromTokenContract.balanceOf(address) as bigint;
        if (userBalance < valueBigInt) {
            console.error("Insufficient Funds")
            return
        }
        //#endregion

        setBtnText("Approving...")
        //#region Need to approve token amount
        const allowanceBalance = await fromTokenContract.allowance(receiver, ccipAddress.ccipContract) as bigint;

        if (allowanceBalance < valueBigInt) {
            const smallUnitValue = value.toLocaleString('fullwide', { useGrouping: false })
            const tx = await fromTokenContract.approve(
                ccipAddress.ccipContract,
                smallUnitValue)
            console.log(tx);

            toast({
                title: "Success",
                description: `Approved: ${tx}`,
            })
        }
        //#endregion

        setBtnText("Building CCIP Data...")
        //#region Need to approve token amount
        const parser = new CCIPMessageParserContract({});
        const payload = await parser.pack(receiver, fromToken.tokenId, value);
        const ccipPackedData = payload.toString();
        console.log(ccipPackedData)
        toast({
            title: "Success",
            description: `Sending CCIP Data: ${ccipPackedData}`,
        })
        //#endregion

        setBtnText("Transferring using CCIP...")
        //#region Need to approve token amount
        const consumer = new FunctionsConsumerContract({
            chain: fromChain,
            client: { public: client, wallet: client, },
        })

        const tx = await consumer.sendRequest(ccipPackedData, toChain);
        console.log("Response: ", tx)
        toast({
            title: "Success",
            description: `Approved: ${tx}`,
        })
        //#endregion
    }
    return (
        <div className="rounded-lg">
            <div className="flex flex-col space-y-2">
                <Label message="Reciever" className="" />
                <Input placeholder="0x" onChange={(e) => setReceiver(e.target.value)}
                    value={receiver} />
                <TransferCard />
            </div>
            <div>
                <DataRow title="From" value={getNetworkNameFromChainID(chainId?.toString() || "")} />
                <DataRow title="To" value={getNetworkNameFromChainID(toChain)} />
            </div>

            <div className="flex">
                <Button className="my-2"
                    onClick={handleTransfer}
                    disabled={isSwapDisabled}
                >
                    {btnText || "Transfer"}
                </Button>
            </div>

            <div className="flex justify-center items-center my-2">
                <PoweredBy />
            </div>


            <div className="bg-grayscale-025">


            </div>
        </div>
    )
}

interface PreviewInfo {
    title: string;
    value: string;
    copy?: boolean;
}
const DataRow = ({ title, value, }: PreviewInfo) => {
    return <div className="flex items-center justify-between">
        <div>
            {title}
        </div>

        <div>
            {value}
        </div>
    </div>
}