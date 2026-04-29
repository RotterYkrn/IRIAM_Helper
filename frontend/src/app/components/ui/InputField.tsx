import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = React.ComponentProps<typeof Input> & {
    label?: string;
    error: string | null;
    setValue: (value: string) => void;
};

const InputField = ({ label, error, setValue, ...inputProps }: Props) => {
    const id = label || crypto.randomUUID();

    return (
        <Label htmlFor={id}>
            {label && (
                <span className="text-md font-medium text-gray-600">
                    {label}
                </span>
            )}
            <div className="relative w-full flex flex-col items-center">
                <Input
                    id={id}
                    aria-invalid={!!error}
                    onChange={(e) => setValue(e.target.value)}
                    {...inputProps}
                />

                {error && (
                    <p
                        className="absolute top-full w-full text-destructive
                            text-sm text-center whitespace-nowrap truncate"
                        title={error}
                    >
                        {error}
                    </p>
                )}
            </div>
        </Label>
    );
};

export default InputField;
