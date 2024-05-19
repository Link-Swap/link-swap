import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export interface AlertDestructiveProps extends React.InputHTMLAttributes<HTMLDivElement> {
    message?: string
}


export function AlertDestructive({
    message,
}: AlertDestructiveProps) {
    return (
        <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {message || "An error occurred"}
            </AlertDescription>
        </Alert>
    )
}