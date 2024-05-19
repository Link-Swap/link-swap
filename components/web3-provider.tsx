"use client"

import { useEffect, useState } from "react"
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    baseSepolia,
    polygonZkEvmCardona,
    sepolia,
    avalancheFuji,
    polygonAmoy,
    gnosisChiado,
    bscTestnet,
    arbitrumSepolia,
    optimismSepolia,
    celoAlfajores,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

interface Web3ProviderProps extends React.HTMLAttributes<HTMLDivElement> {
}

const config = getDefaultConfig({
    appName: 'linkswap',
    projectId: 'a1b35841e59f1b3f83c5a35d6f6c1824',
    chains: [mainnet, sepolia, baseSepolia, avalancheFuji, polygonAmoy,
        bscTestnet, arbitrumSepolia, optimismSepolia, gnosisChiado, celoAlfajores],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: Web3ProviderProps) => {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
}