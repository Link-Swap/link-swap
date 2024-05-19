import { ChainID, getNetworkNameFromChainID } from "../chains";

interface CCIP {
    ccip?: {
        routerAddress: string;
        chainSelector: string;
    },
    functions?: {
        routerAddress: string;
        donId: string;
        gatewayUrls: string[];

    }
    linkAddress: string;
    ccipContract?: string;
    automation?: {
        upkeeper: string;
        link: string;
        active: boolean;
    }
}

export const chains: Record<string, CCIP> = {
    [ChainID.AVALANCHE_FUJI]: {
        ccip: {
            routerAddress: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
            chainSelector: "14767482510784806043",
        },
        functions: {
            routerAddress: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
            donId: "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
        ccipContract: "0x140Fc5EE41087B22EB03d009Ba76b74B22a298E3",
        automation: {
            upkeeper: "0xeFeE8e974e292359CF1ec2256c1e3cC9F6ff1497",
            link: "https://automation.chain.link/fuji/94257710705889246379756109269032191874048012760552136305752133164746108811577",
            active: true,
        }
    },
    [ChainID.BNB_TESTNET]: {
        ccip: {
            routerAddress: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
            chainSelector: "13264668187771770619",
        },
        linkAddress: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
        ccipContract: "0xb1a8ED6906bD10895Ae7D96569A0310e47c85Be5",
    },
    [ChainID.ETHEREUM_SEPOLIA]: {
        ccip: {
            routerAddress: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
            chainSelector: "16015286601757825753",
        },
        functions: {
            routerAddress: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
            donId: "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        ccipContract: "0xE42362e2C2226A881070C48e57f6Cd10748E1dF6",
        automation: {
            upkeeper: "0x9c5c014A81d79f86D946141bdFda5DEEE25Fc3F1",
            link: "https://automation.chain.link/sepolia/0x77df81c34c71b559530ef3a76204708f4c8fa0b7c69efba1178a28b7f1fad56e",
            active: true,
        }
    },
    [ChainID.ARBITRUM_SEPOLIA]: {
        ccip: {
            routerAddress: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
            chainSelector: "3478487238524512106",
        },
        functions: {
            routerAddress: "0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C",
            donId: "0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
        ccipContract: "0x26EF677d60e6715bD052eB5BdB080A8E033e1C17",
    },
    [ChainID.BASE_SEPOLIA]: {
        ccip: {
            routerAddress: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
            chainSelector: "10344971235874465080",
        },
        functions: {
            routerAddress: "0xf9B8fc078197181C841c296C876945aaa425B278",
            donId: "0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
        ccipContract: "0x53B10f104a0739667504964F9b4BBaF286161307",
    },
    [ChainID.KROMA_SEPOLIA]: {
        ccip: {
            routerAddress: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
            chainSelector: "5990477251245693094",
        },
        linkAddress: "0xa75cCA5b404ec6F4BB6EC4853D177FE7057085c8",
        ccipContract: "",
    },
    [ChainID.OPTIMISM_SEPOLIA]: {
        ccip: {
            routerAddress: "0x114A20A10b43D4115e5aeef7345a1A71d2a60C57",
            chainSelector: "5224473277236331295",
        },
        functions: {
            routerAddress: "0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28",
            donId: "0x66756e2d6f7074696d69736d2d7365706f6c69612d3100000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0x73B77a6c134d8666e0aBB7Dc150c8708DBDF41E4",
        ccipContract: "0x1d967071A97597EeD3c10647EEcd86DE69feab61",
        automation: {
            upkeeper: "0x322600C0F4DF1702AA8108766D3d21c9FcD53459",
            link: "https://automation.chain.link/optimism-sepolia/111047010698950747189923764658385864947093431387436204609844010449677308529582",
            active: true,
        }
    },
    [ChainID.WEMIX_TESTNET]: {
        ccip: {
            routerAddress: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
            chainSelector: "14767482510784806043",
        },
        linkAddress: "0x3580c7A817cCD41f7e02143BFa411D4EeAE78093",
        ccipContract: "",
    },
    [ChainID.GNOSIS_CHIADO]: {
        ccip: {
            routerAddress: "0x19b1bac554111517831ACadc0FD119D23Bb14391",
            chainSelector: "8871595565390010547",
        },
        linkAddress: "0xDCA67FD8324990792C0bfaE95903B8A64097754F",
        ccipContract: "0xeDd5e3333fe570cc54a3d6e26DD009de571126AD",
    },
    [ChainID.POLYGON_AMOY]: {
        ccip: {
            routerAddress: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
            chainSelector: "16281711391670634445",
        },
        functions: {
            routerAddress: "0xC22a79eBA640940ABB6dF0f7982cc119578E11De",
            donId: "0x66756e2d706f6c79676f6e2d616d6f792d310000000000000000000000000000",
            gatewayUrls: [
                "https://01.functions-gateway.testnet.chain.link/",
                "https://02.functions-gateway.testnet.chain.link/",
            ],
        },
        linkAddress: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
        ccipContract: "0x87Bca54F5e4D8DfC7C66d28441F815926BA21192",
        automation: {
            upkeeper: "0xeFeE8e974e292359CF1ec2256c1e3cC9F6ff1497",
            link: "https://automation.chain.link/polygon-amoy/0xf45aea7c9c5b009a71ca6f76bb3d610cece91bbfbad706bdd1c6fa166089642e",
            active: true,
        }
    },
    [ChainID.CELO_ALFAJORES]: {
        ccip: {
            routerAddress: "0x57117e2c867503843783544b6A57aE14202eF9d1",
            chainSelector: "3552045678561919002",
        },
        linkAddress: "0x32E08557B14FaD8908025619797221281D439071",
        ccipContract: "0x0c2549DB92613ED09AC65aE467bFc60Da7e6910C",
    },
}

export const getCCIPChains = () => {
    return Object.keys(chains).map((chain) => ({
        value: chain,
        label: getNetworkNameFromChainID(chain),
        disabled: !chains[chain].ccipContract,
    }));
}

export const getCCIPContract = (chain: string) => chains[chain] || null

export const hasUpkeeper = (chain: string) => chains[chain]?.automation?.active || false

export const getUpKeeper = (chain: string) => chains[chain]?.automation?.upkeeper || ""