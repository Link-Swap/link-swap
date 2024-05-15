"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSwapCurrency } from "../provider/currency-select-provider"
import { ChainID } from "@/lib/chains"

interface FunctionBtnProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function FunctionBtn({ }: FunctionBtnProps) {
    const { fromCurrency, fromValue } = useSwapCurrency();

    const handleFunctionCall = async () => {
        const response = await fetch("/api/functions", {
            method: "POST",
            body: JSON.stringify({
                chain: ChainID.AVALANCHE_FUJI,
                asset: fromCurrency,
                amount: fromValue,
            }),
        })
        const data = await response.json()
        console.log(data)
    }

    return <Button
        onClick={handleFunctionCall}
    >
        Simulate Functions
    </Button>
}