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
        ccipContract: "0xDbBe28E3f82cb7FE549759f4365545Aaf4d216e8",
        automation: {
            upkeeper: "0x76baB8bE3658942054Af2EeaDC7DB5975E00E7eA",
            link: "https://automation.chain.link/fuji/32708311151030418577197145235417177243639252957486060249064829418775900977903",
            active: true,
        }
    },
    [ChainID.BNB_TESTNET]: {
        ccip: {
            routerAddress: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
            chainSelector: "13264668187771770619",
        },
        linkAddress: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
        ccipContract: "",
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
        ccipContract: "",
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
        ccipContract: "0x11f00b9fcefc58cdFe2FFD311c4aB490d964f3C0",
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
        ccipContract: "0x18b5500A6a66698275aE0286e57aa03e0B2cF49E",
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
        linkAddress: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
        ccipContract: "0x11f00b9fcefc58cdFe2FFD311c4aB490d964f3C0",
        automation: {
            upkeeper: "0x0dF53a10843657242b8276FFd6260d5fC8c0a55C",
            link: "https://automation.chain.link/optimism-sepolia/6130101799757351563254093353829054416896800108017164536724838508404442701659",
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
        ccipContract: "",
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
        ccipContract: "0xD8fb42CdFE99e2f448c652Eb8d1DF33618a9ee3C",
    },
}

export const getCCIPChains = () => {
    return Object.keys(chains).map((chain) => ({
        value: chain,
        label: getNetworkNameFromChainID(chain),
        disabled: !chains[chain].functions,
    }));
}

export const getCCIPContract = (chain: string) => chains[chain] || null