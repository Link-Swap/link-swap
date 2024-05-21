import { ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useState } from "react";
import { CircleX, CrossIcon } from "lucide-react";

const alertIcon = {
    destructive: <ExclamationTriangleIcon className="h-4 w-4" />,
    warning: <ExclamationTriangleIcon className="h-4 w-4" />,
    accent: <ExclamationTriangleIcon className="h-4 w-4" />,
    default: <InfoCircledIcon className="h-4 w-4" />,
}

export interface AlertProps extends React.InputHTMLAttributes<HTMLDivElement> {
    message?: string
    variant?: "destructive" | "warning" | "accent"
}

export function AlertBanner({
    message,
    variant,
}: AlertProps) {
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
    };

    return show ? (
        <Alert variant={variant || "default"}>
            {/* {alertIcon[variant || "default"]} */}
            <CircleX className="cursor-pointer" height={16} width={16} onClick={handleClose} />

            <AlertTitle>{variant === "warning" || variant === "destructive" ? "Error" : "Info"}</AlertTitle>
            <AlertDescription className="flex justify-between">
                {message || ""}
            </AlertDescription>
        </Alert>
    ) : <></>;
}