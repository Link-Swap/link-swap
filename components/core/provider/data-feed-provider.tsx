"use client"

import { RoundInfo, getChainIdFromBlockchainName, getPrice } from "@/lib/price/data-feed"
import { Feed, queryFeedAddress } from "@/lib/price/get-feed-address"
import { get } from "http"
import React, { createContext, useContext, useEffect, useState } from "react"

export interface RoundData {
    round: RoundInfo,
    price: Number,
    total: Number
}

export const DataFeedProvider = ({ children }: DataFeedProviderProps) => {
    const [cacheFeeds, setCacheFeeds] = useState<any[]>([])

    const [fromDataFeed, setFromDataFeed] = useState<Feed>({} as Feed)
    const [latestFromData, setLastestData] = useState<RoundData>({} as RoundData)
    const [toDataFeed, setToDataFeed] = useState<Feed>({} as Feed)
    const [latestToData, setToData] = useState<RoundData>({} as RoundData)

    useEffect(() => {
        (async () => {
            const roundData = await queryFeedAddress()
            setCacheFeeds(roundData)

            const feedENS = `${"USDC".toLocaleLowerCase()}-${"USD".toLocaleLowerCase()}`
            const dataFeed = roundData.filter((data) => data.ens === feedENS).pop();
            if (!dataFeed) {
                console.log("No data feed found")
                return;
            }
    
            setFromDataFeed(dataFeed)
            setToDataFeed(dataFeed)
        })()
    }, [])

    const updatePrice = async (base: string, quote: string, from: boolean = true) => {
        const feedENS = `${base.toLocaleLowerCase()}-${quote.toLocaleLowerCase()}`
        const dataFeed = cacheFeeds.filter((data) => data.ens === feedENS).pop();
        if (!dataFeed) {
            console.log("No data feed found")
            return;
        }

        if (from) {
            setFromDataFeed(dataFeed)
        } else {
            setToDataFeed(dataFeed)
        }
    }

    const getTotal = async (amount: Number, from: boolean = true) => {
        const feed = from ? fromDataFeed : toDataFeed
        const round = await getPrice(feed.contractAddress as any, getChainIdFromBlockchainName(feed.docs.blockchainName))
        const price = Number(round.answer.toString()) / 10 ** Number(round.decimals.toString())

        const total: Number = price * Number(amount)

        const data = {
            round,
            price,
            total
        }

        if (from) {
            setLastestData(data)
        }
        else {
            setToData(data)
        }

        return data
    }

    return (
        <EditorContext.Provider
            value={{
                updatePrice,
                getTotal,
                latestFromData,
                latestToData
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}

interface DataFeedProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const EditorContext = createContext({
    updatePrice: (base: string, quote: string,  from: boolean = true) => { },
    getTotal: (amount: Number, from: boolean = true) => { },
    latestFromData: {} as RoundData,
    latestToData: {} as RoundData
})

export const useDataFeed = () => useContext(EditorContext)