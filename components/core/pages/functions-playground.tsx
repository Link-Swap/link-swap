"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/core/components/label";
import { Input } from "@/components/core/components/input";
import { Button } from "@/components/ui/button";
import { ChainID, getNetworkNameFromChainID } from "@/lib/chains";
import { LinkSwapToken } from "@/lib/contracts/use-contracts/link-swap-token";
import { getMetamaskClient } from "@/lib/evm/client";
import { CCIPData, CCIPMessageParserContract } from "@/lib/contracts/use-contracts/ccip-data-parser";
import { ChainSelect } from "../transfer/chain-select";
import { ReturnType, decodeResult } from "@/lib/decode";
import { FunctionsConsumerContract } from "@/lib/contracts/use-contracts/chainlink-functions";

interface FunctionSimulatorProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function FunctionSimulator({ }: FunctionSimulatorProps) {
    const [ccipPackedData, setCCIPPackedData] = useState<string>("5300541194335152990211395593643767025159908634661841882844142780077188524");
    const [ccipData, setCCIPData] = useState<CCIPData>({} as CCIPData);

    const [timeLapse, setTimeLapse] = useState<number>(0);
    const [simulateDisable, setSimulateDisable] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [result, setResult] = useState<any>({});

    const handleOracleCall = async () => {
        setSimulateDisable(true);
        setResult({})
        setCCIPData({} as CCIPData);
        setErrorMessage("")

        const start = performance.now();
        const response = await fetch("/api/functions", {
            method: "POST",
            body: JSON.stringify({
                source: sourceChain,
                destination: destinationChain,
                ccipData: ccipPackedData,
            }),
        })

        const end = performance.now();
        setSimulateDisable(false);
        setTimeLapse(end - start)

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.message || "Unknown Error")
            return;
        }

        const data = await response.json();
        setResult(data)

        const parser = new CCIPMessageParserContract({});
        const ccipData = await parser.unpack(ccipPackedData);
        setCCIPData(ccipData);

        console.log(data, ccipData)
    }

    const handleFaucet = async () => {
        const client = await getMetamaskClient();
        if (!client.account) {
            console.log("No account please connect to metamask", client)
            const accounts = await client.requestAddresses() as any[]
            client.account = accounts[0] as any
            // return;
        }

        console.log("ChainId: ", client.chain.id)
        const chainId = await client.getChainId();
        const token = new LinkSwapToken({
            chain: chainId.toString(),
            client: { public: client, wallet: client, }
        })
        const response = await token.faucet();
        console.log("Response: ", response)
    }

    const handleMint = async () => {
        const client = await getMetamaskClient();
        if (!client.account) {
            console.log("No account please connect to metamask", client)
            const accounts = await client.requestAddresses() as any[]
            client.account = accounts[0] as any
            // return;
        }

        console.log("ChainId: ", client.chain.id)
        const chainId = await client.getChainId();
        const token = new LinkSwapToken({
            chain: chainId.toString(),
            client: { public: client, wallet: client, }
        })
        const response = await token.mint("0x3F57090017Bcb972C27C0e673f58813B7F074F4A", "1000000000000000000000000000");
        console.log("Response: ", response)
    }

    const [sourceChain, setSourceChain] = useState<string>(ChainID.ETHEREUM_SEPOLIA)
    const [destinationChain, setDestinationChain] = useState<string>(ChainID.ETHEREUM_SEPOLIA)

    const decodeResults = async () => {
        const value = decodeResult("0x3231353832363939383638373637343637323435333230323935323735373833303039323934373930303637313937323335313635303038303330373132313033323837", ReturnType.string);
        console.log("Decoded Value: ", value)
    }

    const callOracle = async () => {
        const client = await getMetamaskClient();
        if (!client.account) {
            console.log("No account please connect to metamask", client)
            const accounts = await client.requestAddresses() as any[]
            client.account = accounts[0] as any
            // return;
        }

        console.log("ChainId: ", client.chain.id)
        const consumer = new FunctionsConsumerContract({
            chain: (await client.getChainId()).toString(),
            client: { public: client, wallet: client, },

        })

        const tx = await consumer.sendRequest(ccipPackedData, destinationChain);
        console.log("Response: ", tx)
    }

    return (
        <div className="">
            <Button onClick={decodeResults}>
                Decode
            </Button>
            <Button onClick={callOracle}>
                Call Oracle Functions
            </Button>

            <div className="flex items-center justify-between">
                {/* <div>
                    <Label message="From" className="my-8" />
                    <ChainSelect handleSelect={setSourceChain} />
                </div> */}

                <div>
                    <Label message="To" className="my-8" />
                    <ChainSelect handleSelect={setDestinationChain} />
                </div>
            </div>

            <Label message="CCIP Message" className="my-8" />
            <Input placeholder="Message" onChange={(e) => setCCIPPackedData(e.target.value)}
                value={ccipPackedData} />

            <Button onClick={handleOracleCall} disabled={simulateDisable}>
                {simulateDisable ? "Stimulating..." : "Stimulate"}
            </Button>

            <Button onClick={handleFaucet}>Mint</Button>
            <Button onClick={handleMint}>Mint</Button>

            <div>
                <Label message="Time Lapse" className="my-8" />
                {timeLapse && timeLapse} {"ms"}
            </div>
            {errorMessage
                ? <div>
                    <Label message="Error" className="my-8" />
                    {errorMessage}
                </div>
                : <div>
                    {result && <div>
                        <div>
                            <Label message="Result" className="my-8" />
                            {result.result ? result.result : "Failed"}
                        </div>
                        <div>
                            <Label message="Transfer To Chain" className="my-8" />
                            {result.chain && getNetworkNameFromChainID(result.chain)}
                        </div>
                    </div>}

                    {!errorMessage && ccipData && <div>
                        <div>
                            <Label message="CCIP Data" className="my-8" />
                            Sending {ccipData.value && ccipData.value.toString()}  {ccipData.tokenId && ccipData.tokenId} to {ccipData.reciever && ccipData.reciever}
                        </div>
                    </div>}
                </div>}
        </div>
    )
}