import { ChainID } from "../chains"

const feedAPIs = [
    `https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json`,
    `https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json`,
    `https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-polygon-zkevm-1.json`,
    `https://reference-data-directory.vercel.app/feeds-matic-mainnet.json`,
    `https://reference-data-directory.vercel.app/mainnet.json`,
    `https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json`,
]

const assetSymbolToAddress = async (feeds: Feed[], chain: string = ChainID.ETHEREUM_MAINNET) => {
    const response = await fetch(`https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/ethereum.json`)
    const data = await response.json()
    const tokenDictionary: { [key: string]: Token } = data.reduce((acc: any, token: any) => {
        acc[token.symbol] = token;
        return acc;
    }, {});

    const validFeeds: Feed[] = []
    const assets = new Map<string, Token>();
    feeds.forEach((feed) => {
        const baseAsset = tokenDictionary[feed.docs.baseAsset]
        const quoteAsset = tokenDictionary[feed.docs.quoteAsset]
        if (!baseAsset || !quoteAsset) {
            // console.log(`No token found for ${feed.docs.baseAsset}, ${feed.docs.quoteAsset}`);
            return;
        }

        assets.set(feed.docs.baseAsset, baseAsset);
        assets.set(feed.docs.quoteAsset, quoteAsset);
        validFeeds.push(feed);
    })
    return { validFeeds, assets }
}

export const queryFeedAddress = async () => {
    let feeds: Feed[] = await combineAPIResponses(feedAPIs)

    feeds = filterUniqueEns(feeds)

    const { validFeeds, assets } = await assetSymbolToAddress(feeds)
    console.log(validFeeds, assets)

    return feeds
}

async function combineAPIResponses(urls: string[]) {
    try {
        const responses = await Promise.allSettled(urls.map(url => fetchData(url)));
        return responses
            .filter(result => result.status === 'fulfilled')
            .map((result: any) => result.value)
            .flat() as Feed[];
    } catch (error) {
        console.error('Error combining API responses:', error);
        return [];
    }
}

async function fetchData(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
}

const filterUniqueEns = (feeds: any[]) => {
    // feeds
    //     .filter((feed) => (feed.feedCategory === "low" || feed.feedCategory === "medium")
    //         && feed.feedType === "Crypto"
    //         && feed.ens != null)
    //     .forEach((feed) => {
    //         console.log(feed)
    //     })
    const uniqueEnsMap = new Map<string, any>();
    feeds.forEach((feed) => {
        if ((feed.feedCategory === "low" || feed.feedCategory === "medium") &&
            feed.feedType === "Crypto" &&
            feed.ens != null) {
            // Use feed.ens as the key in the map to ensure uniqueness
            uniqueEnsMap.set(feed.ens, feed);
        }
    });

    return Array.from(uniqueEnsMap.values());
}

export interface Feed {
    assetName: string;
    compareOffchain: string;
    contractAddress: string;
    contractType: string;
    contractVersion: number;
    decimalPlaces: number | null;
    decimals: number;
    docs: {
        assetClass: string;
        baseAsset: string;
        baseAssetClic: string;
        blockchainName: string;
        clicProductName: string;
        deliveryChannelCode: string;
        feedCategory: "low" | "medium" | "high";
        feedType: string;
        marketHours: string;
        productSubType: string;
        productType: string;
        productTypeCode: string;
        quoteAsset: string;
        quoteAssetClic: string;
    },
    ens: string;
    formatDecimalPlaces: number | null;
    healthPrice: string;
    heartbeat: number;
    history: any; // Type accordingly based on the expected data type
    multiply: string;
    name: string;
    pair: [string, string];
    path: string;
    proxyAddress: string;
    threshold: number;
    valuePrefix: string;
}

interface Token {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}