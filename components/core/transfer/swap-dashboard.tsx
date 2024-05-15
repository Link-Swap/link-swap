"use client"

import * as React from "react"
import { Swap } from "./swap"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface SwapDasboardProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function SwapDashboard({
}: SwapDasboardProps) {
    return (
        <div className="flex justify-center items-center h-[100vh] w-[100vw]">
            <div>
                <div className="my-4 flex justify-center">
                    <ConnectButton />
                </div>

                <Swap />
            </div>
        </div>
    )
}