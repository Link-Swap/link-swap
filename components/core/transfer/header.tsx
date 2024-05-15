"use client"

import * as React from "react"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
}

export function Header({
    title = "Swap using CCIP",
}: HeaderProps) {
    return (
        <div className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
        </div>
    )
}