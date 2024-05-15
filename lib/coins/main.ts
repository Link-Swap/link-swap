import { ETH } from "./eth";
import { LINK } from "./link";
import { USDC } from "./usdc";
import { LSWAP } from "./lswap";

export const tokens: Record<string, any> = {
    ["ETH"]: {
        name: "Ethereum",
        image: "/icons/eth.svg",
        addresses: ETH
    },
    ["USDC"]: {
        name: "USDC",
        image: "/icons/usdc.svg",
        addresses: USDC
    },
    ["LINK"]: {
        name: "Chainlink",
        image: "/icons/link.svg",
        addresses: LINK
    },
    ["LSWAP"]: {
        name: "LinkSwap",
        image: "/icons/link.svg",
        addresses: LSWAP
    },
    ["AAVE"]: {
        name: "Aave",
        image: "/icons/aave.svg",
        addresses: {}
    },
    ["BAT"]: {
        name: "Basic Attention Token",
        image: "/icons/bat.svg",
        addresses: {}
    }
}

export const getTokenAddressForChain = (symbol: string, chain: string): string => {
    console.log("getTokenAddressForChain", symbol, chain, tokens[symbol]?.addresses);
    return tokens[symbol]?.addresses[chain] || "";
}

export const getTokenIcon = (symbol: string): string => {
    return tokens[symbol]?.image || "";
}

export const getAvailableTransferTokens = () => {
    return tokens;
}

export const getAvailableSwappableTokens = () => {
    return {};
}