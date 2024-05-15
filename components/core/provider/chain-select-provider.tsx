"use client"

import { ChainID } from "@/lib/chains"
import React, { createContext, useContext, useState } from "react"

export const SwapChainProvider = ({ children }: SwapChainProviderProps) => {
    const [fromChain, setFromChain] = useState<string>(ChainID.ETHEREUM_SEPOLIA)
    const [toChain, setToChain] = useState<string>(ChainID.ETHEREUM_SEPOLIA)

    return (
        <EditorContext.Provider
            value={{
                fromChain,
                toChain,
                setFromChain,
                setToChain,
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}

interface SwapChainProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const EditorContext = createContext({
    fromChain: "",
    toChain: "",
    setFromChain: (chain: string) => { },
    setToChain: (chain: string) => { },
})

export const useSwapChains = () => useContext(EditorContext)