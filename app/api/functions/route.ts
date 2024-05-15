import { loadToken } from "@/lib/coins/contract";
import { getTokenAddressForChain } from "@/lib/coins/main";
import { CCIPMessageParserContract } from "@/lib/contracts/use-contracts/ccip-data-parser";
import { FunctionDataParserContract } from "@/lib/contracts/use-contracts/functions-parser";
import { LinkSwapTokenListContract } from "@/lib/contracts/use-contracts/token-list";
import { getCCIPContract } from "@/lib/price/ccip";
import { NextRequest, NextResponse } from "next/server";
import { zeroAddress } from "viem";

// source-code.js
// const response = await Functions.makeHttpRequest(
// 	{
// 		url: "https://URL/api/functions",
// 		method: "POST",
// 		timeout: 9000,
//      data: {
//          chain: "1",
//          tokenId: 1,
//          amount: "100000",
//      }
// 	}
// );

// args:
// 0 - ccip
// 1 - destination chain

// Chainlink Function should call this to validation check cross chain
export async function POST(request: NextRequest) {
    const data = await request.json()
    // const sourceChain = data.source    // source chain
    const destinationChain = data.destination    // destination chain
    const ccip = data.ccipData || ""

    // This will be saved onchain for when we successfully validate transfer is possible
    const messageParser = new CCIPMessageParserContract({})
    const ccipData = await messageParser.unpack(ccip)
    if (ccipData.reciever === zeroAddress) {
        return NextResponse.json({ "message": "Invalid CCIP Message" }, { status: 400 })
    }

    // Get destination ccip chain contract. This will check if chain is supported
    const ccipAddress = getCCIPContract(destinationChain)
    if (!ccipAddress.ccip) {
        return NextResponse.json({ "message": "Unsupport Chains" }, { status: 400 })
    }

    if (!ccipAddress.ccipContract) {
        return NextResponse.json({ "message": "Unsupport Chains" }, { status: 400 })
    }

    // Get corresponding token address for the destination chain. This will ceck if token is supported
    const tokenList = new LinkSwapTokenListContract({ chain: destinationChain });
    const tokenAddress = await tokenList.getToken(Number(ccipData.tokenId))
    if (tokenAddress === zeroAddress) {
        return NextResponse.json({ "message": "Token is not supported" }, { status: 400 })
    }

    // Load token contract
    let result = ""

    console.log("CCIP Address, token Address: ", ccipAddress.ccipContract, tokenAddress)
    const tokenContract = await loadToken(destinationChain, tokenAddress)

    // Check if ccip contract has enough balance to cross transfer
    const balance = await tokenContract.read.balanceOf([ccipAddress.ccipContract]) as bigint
    console.log("Balance: ", balance, ccipData.value)
    if (balance === BigInt(0) || balance < ccipData.value) {
        return NextResponse.json({ "message": "Insuccient balance for transfer" }, { status: 400 })
    }

    const dataParser = new FunctionDataParserContract({});
    result = (await dataParser.pack(ccipAddress.ccip.chainSelector, ccipAddress.ccipContract)).toString()

    return NextResponse.json({
        chain: destinationChain,
        result,
        router: ccipAddress.ccip.routerAddress,
        selector: ccipAddress.ccip.chainSelector,
        ccipAddress: ccipAddress.ccipContract,
        tokenId: ccipData.tokenId,
    })
}

// empty string means no error and validation passed
const doesAccountHaveEnoughBalance = async (chain: string, tokenId: number, amount: number, account: string) => {
    const tokenList = new LinkSwapTokenListContract({ chain });
    const tokenAddress = await tokenList.getToken(Number(tokenId))
    if (tokenAddress === zeroAddress) {
        return "Token is not supported"
    }

    const tokenContract = await loadToken(chain, tokenAddress)

    const balance = await tokenContract.read.balanceOf([account]) as bigint
    console.log("Balance: ", balance)
    if (balance === BigInt(0) || balance < amount) {
        return "Insuccient balance for transfer"
    }

    return "";
}