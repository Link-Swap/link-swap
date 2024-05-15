"use client"

import { Input } from "@/components/ui/input"
import { useDataFeed } from "../provider/data-feed-provider"
import { useState } from "react";
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
    const { fromValue, toValue, setFromValue, setToValue } = useSwapCurrency()
    const [value, setValue] = useState<string>("0.0")

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)

        // Typically if transfer, then the to is disabled
        setFromValue(Number(e.target.value))
        if (type === "transfer") {
            setToValue(Number(e.target.value))
        }
        await getTotal(Number(e.target.value), from)
    }

    return (
        <Input type="number"
            disabled={disabled}
            onChange={handleOnChange}
            min={0}
            value={from ? fromValue : toValue}
            className="p-[16px] rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl border-none shadow-none"
            placeholder="0.0" />
    )
}