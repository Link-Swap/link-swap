import { abi } from '@/lib/contracts/abi/chainlink-ccip';
import { bytecode } from './bytecode/chainlink-ccip';

import { getWallet } from './get-wallet';
import { getCCIPContract } from '../price/ccip';

export const deployCCIPContract = async (chain: string) => {
    const config = getCCIPContract(chain);

    const client = await getWallet(chain);

    const hash = await client.deployContract({
        abi,
        account: client.account.address,
        bytecode: `0x${bytecode}`,
        args: [config.ccip?.routerAddress, config.linkAddress]
    })

    console.log(hash);
}