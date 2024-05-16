"use client"

import * as React from "react"
import Image from "next/image"

interface PoweredByProps extends React.HTMLAttributes<HTMLDivElement> {
}

const services = [
    { name: "CCIP", icon: "https://docs.chain.link/assets/icons/ccip-navbar-icon.svg" },
    { name: "DataFeed", icon: "https://docs.chain.link/assets/icons/data-navbar-icon.svg" },
    { name: "Function", icon: "https://docs.chain.link/assets/icons/functions-navbar-icon.svg" },
]

export function PoweredBy({ }: PoweredByProps) {
    return <div className="flex space-x-1">
        Powered By
        {services.map((service) => (
            <div key={service.name} className="flex items-center">
                <Image src={service.icon} alt={service.name} width={24} height={24} />
                <div>{service.name}</div>
            </div>
        ))}
    </div>
}