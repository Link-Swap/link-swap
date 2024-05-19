"use client"

import { Button } from "@/components/ui/button"
import { useSwapChains } from "@/components/core/provider/chain-select-provider"
import { useSwapCurrency } from "@/components/core/provider/currency-select-provider"
import { PoweredBy } from "@/components/core/components/powered-by"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ChainID, getIconByChainId, getNetworkNameFromChainID } from "@/lib/chains"
import { TransferCard } from "./transfer-card"
import { LinkSwapTokenListContract } from "@/lib/contracts/use-contracts/token-list"
import { LinkSwapTokenContract } from "@/lib/contracts/use-contracts/link-swap-token"
import { getClient, getMetamaskClient } from "@/lib/evm/client"
import { Label } from "../components/label"
import { Input } from "../components/input"
import { decodeAbiParameters, isAddress, parseAbiItem, parseAbiParameters } from "viem"
import { getCCIPContract, getUpKeeper, hasUpkeeper } from "@/lib/price/ccip"
import { useToast } from "@/components/ui/use-toast"
import { FunctionsConsumerContract } from "@/lib/contracts/use-contracts/chainlink-functions"
import { CCIPMessageParserContract } from "@/lib/contracts/use-contracts/ccip-data-parser"
import { abi } from "@/lib/contracts/abi/token-transfer"
import { CCIPTokenTransferContract } from "@/lib/contracts/use-contracts/chainlink-ccip"
import { FunctionDataParserContract } from "@/lib/contracts/use-contracts/functions-parser"
import { connectContracts } from "@/lib/scripts/2-connect-contracts"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpLeftFromSquareIcon, CircleDollarSign } from "lucide-react"
import { CopyText } from "../components/copy-text"
import { deployCCIPContract } from "@/lib/scripts/0-deploy-contracts"
import { setupSelectors } from "@/lib/scripts/1-setup-selectors"
import { AlertBanner } from "../components/alerts"

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

    const [error, setError] = useState<string>("")
    const [receipt, setReceipt] = useState<string>("")

    useEffect(() => {
        if (address)
            setReceiver(address)
    }, [])


    const [canUseOracle, setCanUseOracle] = useState<boolean>(false)

    useEffect(() => {
        if (!chainId) {
            return;
        }

        setCanUseOracle(false)
        if (hasUpkeeper(chainId.toString())) {
            setCanUseOracle(true)
        }
    }, [chainId])

    const handleTransfer = async () => {
        try {
            setError("")
            setReceipt("")
            setIsSwapDisabled(true)

            setBtnText("Validating funds...")

            await doTransfer()
        } catch (error: any) {
            console.error(error)
            setError(error.toString())
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
            throw new Error("Chain Not Supported")
        }

        const contract = new LinkSwapTokenListContract({
            chain: fromChain
        })
        const fromToken = await contract.getTokenWithInfo(toCurrency.tokenId);

        const client = await getMetamaskClient();
        const publicClient = getClient(fromChain);

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
            throw new Error("Insufficient Funds")
        }
        //#endregion

        setBtnText("Building CCIP Data...")
        //#region Need to approve token amount
        const parser = new CCIPMessageParserContract({});
        const payload = await parser.pack(receiver, fromToken.tokenId, value);
        const ccipPackedData = payload.toString();
        console.log("CCIP Data: ", ccipPackedData)
        //#endregion

        setBtnText("Approving...")
        //#region Need to approve token amount
        const allowanceBalance = await fromTokenContract.allowance(receiver, ccipAddress.ccipContract) as bigint;
        // console.log("Allowance: ", allowanceBalance, valueBigInt)
        if (allowanceBalance < valueBigInt) {
            const smallUnitValue = value.toLocaleString('fullwide', { useGrouping: false })
            const tx = await fromTokenContract.approve(
                ccipAddress.ccipContract,
                smallUnitValue)
            const transaction = await publicClient.waitForTransactionReceipt({ hash: tx })
            console.log(tx);

            toast({
                title: "Success",
                description: `Approved: ${tx}`,
            })
        }
        //#endregion

        if (!hasUpkeeper(fromChain)) {
            console.log("Chain doesn't support on chain validation")
            console.log("Verifying off chain ...")

            const response = await fetch("/api/functions", {
                method: "POST",
                body: JSON.stringify({
                    destination: toChain,
                    ccipData: ccipPackedData,
                }),
            })
            const data = await response.json();
            console.log("Response: ", data)

            if (data.message) {
                throw new Error(data.message)
            }

            if (!data.result) {
                throw new Error("Failed to verify")
            }

            setBtnText("Approving CCIP...")
            const ccipContract = new CCIPTokenTransferContract({
                chain: fromChain,
                client: { public: client, wallet: client, },
            })

            const isAllowed = await ccipContract.allowListedAddress(address);
            // If not allowed then we must set the address for future token transfer
            if (!isAllowed) {
                const tx = await ccipContract.allowlistAddress(address);

                const publicClient = getClient(fromChain);
                const transaction = await publicClient.waitForTransactionReceipt({ hash: tx })
                toast({
                    title: "Success",
                    description: `CCIP Approved, this is a one time process.`,
                })
            }

            // This should call the CCIP contracts sendPAyLink function
            const parse = new FunctionDataParserContract({});
            const ccipArgs = await parse.unpack(data.result);
            console.log("Args: ", ccipArgs.destinationChainSelector.toString(), ccipArgs.receiver, ccipPackedData, address);

            const tx = await ccipContract.sendMessagePayLINK(ccipArgs.destinationChainSelector.toString(), ccipArgs.receiver, ccipPackedData, address);
            const transaction = await publicClient.waitForTransactionReceipt({ hash: tx })
            setReceipt(tx)

            toast({
                title: "Success",
                description: `Approved to call Token Transfer ${tx}`,
            })
            return;
        }

        setBtnText("Transferring using CCIP...")
        //#region Need to approve token amount
        const consumer = new FunctionsConsumerContract({
            chain: fromChain,
            client: { public: client, wallet: client, },
        })

        // const gas = await consumer.sendRequestEstimateGas(ccipPackedData, toChain);
        // const ccipGas = await CCIPEstimateGas();

        // console.log("Estimated Gas: ", gas, ccipGas)
        // console.log("Total Gas: ", gas + ccipGas)

        const tx = await consumer.sendRequest(ccipPackedData, toChain);
        console.log("Response: ", tx)
        toast({
            title: "Success",
            description: `Approved: ${tx}`,
        })

        const upkeeper = getUpKeeper(fromChain) as `0x${string}`
        console.log("Watching for tx: ", upkeeper)
        setReceipt("Please wait for the transaction to be confirmed. This may take a few seconds.")
        const unwatch = publicClient.watchEvent({
            address: upkeeper,
            event: parseAbiItem('event CountedBy(address indexed msgSender, bytes32 messageId)'),
            onLogs: logs => {
                const ccipLog = logs.filter(log => JSON.stringify(log.args.msgSender === address)).pop()
                setReceipt(ccipLog?.args?.messageId?.toString() || "Unknown Transaction, See CCIP Explorer for more details")
                unwatch()
            }
        })

        //#endregion
    }

    const CCIPEstimateGas = async () => {
        const fromChain = chainId?.toString() || "";
        const client = getClient(fromChain);

        const gas = await client.estimateContractGas({
            address: "0xC15A22DBf36aD05b9533D5645F0e15F952F7E71D",
            abi: abi,
            functionName: 'sendMessagePayLINK',
            args: ["10344971235874465080",
                "0x18b5500A6a66698275aE0286e57aa03e0B2cF49E",
                "1766993214942117419875118800682341442235512937620834629515197313842082887",
                "0xA327f039b95703fa84D507e7338FB680D2BEf447",
            ],
            account: address,
        })

        return gas;
    }

    const play = async () => {

        //#region Event Decoder
        // const data = "000100056bc75e2d63100000a327f039b95703fa84d507e7338fb680d2bef4470000000000000000000000000000000000000000000000000000000000000060000000000000000000000000a327f039b95703fa84d507e7338fb680d2bef4470000000000000000000000000000000000000000000000000000000000000044323135383236393938363837363734363732343530313634303837303830343235353736373837393536373330353737393838353534303832353536323736383336313300000000000000000000000000000000000000000000000000000000"
        // const data = "de411e866e0d27ce0f84793b395efea6cd48993ca8e26a008e118e8fdae1ac1d";
        // const values = decodeAbiParameters(
        //     // parseAbiParameters('uint256 ccipData, bytes ccipArgs, address payer'),
        //     parseAbiParameters('bytes32 message'),
        //     `0x${data}`
        // )
        // console.log(values)
        //#endregion

        // await deployCCIPContract(ChainID.POLYGON_AMOY)
        const chains = [
            // ChainID.AVALANCHE_FUJI,
            // ChainID.POLYGON_AMOY,
            // ChainID.ETHEREUM_SEPOLIA,
            // ChainID.BASE_SEPOLIA,
            // ChainID.OPTIMISM_SEPOLIA,
            // ChainID.ARBITRUM_SEPOLIA,
            // ChainID.BNB_TESTNET,
            // ChainID.GNOSIS_CHIADO,
            ChainID.CELO_ALFAJORES,
        ]
        for (const chain of chains) {
            await setupSelectors(chain)
        }
        for (const chain of chains) {
            await connectContracts(chain)
        }
    }


    return (
        <div className="rounded-lg md:w-[50%]">
            {/* <Button onClick={play}>
                Play
            </Button> */}

            {error && <AlertBanner variant="destructive" message={error} />}

            {receipt && <AlertBanner message={receipt} />}
            {error && <AlertBanner variant="destructive" message={error} />}
            <div className="flex flex-col space-y-2">
                <Label message="Reciever" className="" />
                <Input placeholder="0x" onChange={(e) => setReceiver(e.target.value)}
                    value={receiver} />
                <TransferCard />
            </div>
            <div className="border border-border rounded-2xl divide-y divide-border my-2">
                <DataRow title="Sending" value={receiver} icon={<ArrowRight size={12} />} />
                <DataRow title={toCurrency?.name || ""} value={`${toValue.toString() || "0"} ${toCurrency?.symbol || ""}`} icon={<CircleDollarSign size={12} />} />
                <DataRow title="From" value={getNetworkNameFromChainID(chainId?.toString() || "")} icon={<ArrowLeft size={12} />} />
                <DataRow title="To" value={getNetworkNameFromChainID(toChain)} icon={<ArrowRight size={12} />} />
            </div>

            {!canUseOracle && chainId && <AlertBanner
                variant="warning"
                message="Chainlink Function validation not supported. Cross-chain transfers are handled directly off-chain via CCIP. No impact on flow. Supported on Fuji, Amoy, Sepolia, and Optimism Sepolia."
            />}

            <div className="flex">
                <Button className="w-full my-2"
                    onClick={handleTransfer}
                    disabled={isSwapDisabled || !chainId}
                >
                    {btnText || "Transfer"}
                </Button>
            </div>

            <div className="flex justify-center items-center my-2">
                <PoweredBy />
            </div>
        </div>
    )
}

interface PreviewInfo {
    title: string;
    value: string;
    copy?: boolean;
    icon?: React.ReactNode;
}
const DataRow = ({ title, value, copy, icon }: PreviewInfo) => {
    return <div className="flex items-center justify-between px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
            {icon && icon}
            {title}
        </div>

        <div>
            {value}
            {copy &&
                <CopyText payload={value} />}
        </div>
    </div>
}