"use client"

import { cn } from "@/lib/utils";

interface MessageHelperProps extends React.HTMLAttributes<HTMLDivElement> {
    message?: string;
}

export function Label({
    message,
    className,
}: MessageHelperProps) {
    return <div className={cn("text-lg font-semibold leading-none tracking-tight !mb-2", className)} >
        {message || ""}
    </div>
}