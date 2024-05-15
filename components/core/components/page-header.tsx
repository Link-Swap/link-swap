"use client"

import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    message?: string;
}

export function PageHeader({
    message,
    className,
}: PageHeaderProps) {
    return <label className={cn("text-4xl font-semibold leading-[1.1]", className)} >
        {message || ""}
    </label>
}