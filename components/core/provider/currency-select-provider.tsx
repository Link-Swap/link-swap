"use client"

import { TokenInfoPlus } from "@/lib/contracts/use-contracts/token-list"
import React, { createContext, useContext, useState } from "react"

export const SwapCurrencyProvider = ({ children }: SwapCurrencyProviderProps) => {
    const [type, setType] = useState<"swap" | "transfer">("transfer")
    const [fromCurrency, setFromCurrency] = useState<TokenInfoPlus>({

    } as TokenInfoPlus)
    const [toCurrency, setToCurrency] = useState<TokenInfoPlus>({

    } as TokenInfoPlus)

    const [fromValue, setFromValue] = useState<number>(0)
    const [toValue, setToValue] = useState<number>(0)

    return (
        <EditorContext.Provider
            value={{
                type,
                setType,
                fromCurrency,
                setFromCurrency,
                toCurrency,
                setToCurrency,

                fromValue,
                setFromValue,
                toValue,
                setToValue,
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}

interface SwapCurrencyProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const EditorContext = createContext({
    type: "transfer",
    setType: (type: "swap" | "transfer") => { },
    fromCurrency: {} as TokenInfoPlus,
    setFromCurrency: (currency: TokenInfoPlus) => { },
    toCurrency: {} as TokenInfoPlus,
    setToCurrency: (currency: TokenInfoPlus) => { },

    fromValue: 0,
    setFromValue: (value: number) => { },
    toValue: 0,
    setToValue: (value: number) => { },
})

export const useSwapCurrency = () => useContext(EditorContext)