"use client"

import React, { createContext, useContext, useState } from "react"

export const SwapCurrencyProvider = ({ children }: SwapCurrencyProviderProps) => {
    const [type, setType] = useState<"swap" | "transfer">("transfer")
    const [fromCurrency, setFromCurrency] = useState<string>("USDC")
    const [toCurrency, setToCurrency] = useState<string>("USD")

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
    fromCurrency: "",
    setFromCurrency: (currency: string) => { },
    toCurrency: "",
    setToCurrency: (currency: string) => { },

    fromValue: 0,
    setFromValue: (value: number) => { },
    toValue: 0,
    setToValue: (value: number) => { },
})

export const useSwapCurrency = () => useContext(EditorContext)