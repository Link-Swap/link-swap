"use client"

import { cn } from "@/lib/utils";
import { Input as InputX } from "@/components/ui/input";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function Input({
    className,
    ...props
}: InputProps) {
    return <InputX className={cn("truncate appearance-none min-h-[40px] h-[40px] py-2 border-0 rounded-2xl font-medium bg-grayscale-025", className)}
        {...props}
    />
}