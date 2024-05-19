import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainID, getRPC } from '../chains'
import { getVeimChain } from '../evm/client'

export const supportTestChains = [
    ChainID.AVALANCHE_FUJI,
    ChainID.POLYGON_AMOY,
    ChainID.ETHEREUM_SEPOLIA,
    ChainID.BASE_SEPOLIA,
    ChainID.OPTIMISM_SEPOLIA,
    ChainID.ARBITRUM_SEPOLIA,
    ChainID.BNB_TESTNET,
    ChainID.GNOSIS_CHIADO,
]

export const getWallet = async (chain: string) => {
    const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}` as `0x${string}`)
    const rpcUrl = getRPC(chain)
    const chainInfo = getVeimChain(chain)

    return createWalletClient({
        account,
        chain: chainInfo,
        transport: http(rpcUrl),
    })
}