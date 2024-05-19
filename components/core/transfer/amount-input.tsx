"use client"

import { Input } from "@/components/ui/input"
import { useDataFeed } from "../provider/data-feed-provider"
import { useEffect, useState } from "react";
import { useSwapCurrency } from "../provider/currency-select-provider";

interface AmountInputProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "swap" | "transfer"
    disabled?: boolean,
    from?: boolean
}

export function AmountInput({
    type = "transfer",
    disabled = false,
    from = true,
}: AmountInputProps) {
    const { getTotal } = useDataFeed();
    const { toCurrency, setFromValue, setToValue } = useSwapCurrency()
    const [value, setValue] = useState<string>("0.0")

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await updatePrice(e.target.value)
    }

    const updatePrice = async (value: string) => {
        setValue(value)

        // Typically if transfer, then the to is disabled
        setFromValue(Number(value))
        if (type === "transfer") {
            setToValue(Number(value))
        }

        console.log("toCurrency", toCurrency, value, from)
        if (!toCurrency || value === "0" || value === "0.0") {
            return;
        }
        await getTotal(Number(value), from)
    }

    useEffect(() => {
        (async () => {
            await updatePrice(value)
        })()
    }, [toCurrency])

    return (
        <Input type="number"
            disabled={disabled}
            onChange={handleOnChange}
            min={0}
            value={value}
            className="p-[16px] rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl border-none shadow-none"
            placeholder="0.0" />
    )
}