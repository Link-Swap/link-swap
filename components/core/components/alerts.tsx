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
            {alertIcon[variant || "default"]}
            <AlertTitle>Info</AlertTitle>
            <AlertDescription className="flex">
                {message || ""}
                <CircleX className="cursor-pointer" onClick={handleClose} />
            </AlertDescription>
        </Alert>
    ) : <></>;
}