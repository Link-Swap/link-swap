"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme"

import { ArrowLeftRight, Menu } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react"
import Link from "next/link"

const title = "LinkSwap"
const components: { title: string; href: string; description: string }[] = [
    {
        title: "CCIP Data Builder",
        href: "/builder",
        description:
            "Create and validate CCIP data for cross-chain transfers and swaps.",
    },
    {
        title: "Oracle Simulator",
        href: "/simulate",
        description:
            "Pass and simulate CCIP data to validate Chainlink Functions for CCIP transfer or swap.",
    },
    {
        title: "Faucet",
        href: "/faucet",
        description:
            "Drip and Test token for playing with LinkSwap.",
    },
]

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> { }

export const NavBar = ({ }: NavBarProps) => {
    const [showNavBar, setShowNavBar] = useState(false)
    const handleNavBar = () => {
        setShowNavBar(!showNavBar)
    }

    return (
        <div className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex items-center justify-between py-2">
                <div className="flex gap-6 md:gap-10">
                    <a className="hidden items-center space-x-2 md:flex" href="/">
                        <ArrowLeftRight height={24} className="text-primary" />
                        <span className="hidden font-bold sm:inline-block text-2xl">
                            {title}
                        </span>
                    </a>
                    <nav className="hidden gap-6 md:flex">
                        <NavMenu />
                    </nav>
                    <button
                        className="flex items-center space-x-2 md:hidden"
                        onClick={handleNavBar}
                    >
                        <Menu />
                        <span className="font-bold">Menu</span>
                    </button>
                    <div
                        className={cn(
                            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
                            `${showNavBar ? "visible" : "hidden"}`
                        )}
                    >
                        <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
                            <nav className="grid grid-flow-row auto-rows-max text-sm space-y-4">
                                <nav>
                                    <NavMenu />
                                </nav>
                                <div className="flex space-x-4">
                                    <ConnectButton />
                                    <ThemeToggle />
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                <nav
                    className="hidden md:flex items-center z-50"
                    style={{ zIndex: 999 }}
                >
                    <ConnectButton />
                    <ThemeToggle />
                </nav>
                <div className="flex md:hidden">
                    <a className="flex items-center space-x-2" href="/">
                        <ArrowLeftRight height={24} className="text-primary" />
                        <span className="hidden font-bold sm:inline-block text-2xl">
                            {title}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    )
}

const NavMenu = () => {
    return <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Transfer
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/swap" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Swap
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Toolings</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {components.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                        ))}
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
}
const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"