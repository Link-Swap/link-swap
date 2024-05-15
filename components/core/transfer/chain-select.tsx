"use client"

import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getCCIPChains } from "@/lib/price/ccip"
import Image from "next/image"
import { ChainID, getIconByChainId } from "@/lib/chains"

interface ChainSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    handleSelect: Function;
}

const chains = getCCIPChains()
export function ChainSelect({
    handleSelect
}: ChainSelectProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(ChainID.ETHEREUM_SEPOLIA as string)

    useEffect(() => {
        handleSelect(value)
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between bg-grayscale-100"
                >
                    {value &&
                        <Image src={getIconByChainId(value)} alt={value} width={16} height={16} />}

                    {value
                        ? chains.find((framework) => framework.value === value)?.label
                        : "Select chain"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        {chains.map((chain) => (
                            <CommandItem
                                key={chain.value}
                                value={chain.value}
                                disabled={chain.disabled}
                                onSelect={(currentValue) => {
                                    setValue(chain.value)
                                    setOpen(false)
                                }}
                            >
                                <Image src={getIconByChainId(chain.value)} alt={chain.value} width={16} height={16} />
                                {chain.label} {chain.disabled && "Coming Soon"}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
