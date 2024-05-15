import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { avalancheFuji, baseSepolia, mainnet, sepolia, polygonMumbai, polygon, bscTestnet, celoAlfajores } from 'viem/chains'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ChainID, getRPC } from '../chains'

// Dumb design by veim!
const getVeimChain = (chain: string) => {
    switch (chain) {
        case ChainID.AVALANCHE_FUJI:
            return avalancheFuji
        case ChainID.BASE_SEPOLIA:
            return baseSepolia;
        case ChainID.ETHEREUM_SEPOLIA:
            return sepolia;
        case ChainID.ETHEREUM_MAINNET:
            return mainnet;
        case ChainID.POLYGON_MAINNET:
            return polygon;
        case ChainID.POLYGON_MUMBAI:
            return polygonMumbai;
        case ChainID.BNB_TESTNET:
            return bscTestnet;
        case ChainID.CELO_ALFAJORES:
            return celoAlfajores;
        default:
            return undefined
    }
}
export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
})

export const getClient = (chain: string = ChainID.ETHEREUM_MAINNET) => {
    const rpcUrl = getRPC(chain)
    return createPublicClient({
        transport: http(rpcUrl),
    })
}

// Use Metamask
export const getMetamaskClient = async () => {
    const chainHex = await window.ethereum?.request({ method: "eth_chainId" }) as string;
    const [account] = await window.ethereum!.request({ method: "eth_requestAccounts" }) as any
    const chainId = parseInt(chainHex, 16).toString()
    const chain = getVeimChain(chainId)

    return createWalletClient({
        account,
        chain,
        transport: custom(window.ethereum!),
    })
}