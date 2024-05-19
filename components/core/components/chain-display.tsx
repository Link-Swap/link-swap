"use client"

import {
    getIconByChainId,
    getNetworkNameFromChainID
} from "@/lib/chains";
import Image from "next/image";

export interface ChainDisplayProps extends React.InputHTMLAttributes<HTMLDivElement> {
    chainId: string;
    title?: string
}

export function ChainDisplay({
    title,
    chainId,
    className,
    ...props
}: ChainDisplayProps) {
    return <div className={className} {...props}>
        <Image src={getIconByChainId(chainId.toString())} alt="from" width={32} height={32} />
        <div>
            {title &&
                <span className="text-muted-foreground text-xs font-medium leading-4">{title}</span>}
            <span className="text-sm md:text-sm font-F leading-4 block tracking-tight" style={{ "lineHeight": "1em", }}>
                {getNetworkNameFromChainID(chainId.toString())}
            </span>
        </div>
    </div>
}