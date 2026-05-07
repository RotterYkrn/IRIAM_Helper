import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    value: { hour: string; minute: string };
    onChange: (value: { hour: string; minute: string }) => void;
};

export function TimePicker({ value, onChange }: Props) {
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0"),
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0"),
    );

    return (
        <div className="flex items-center gap-2">
            <Select
                value={value.hour}
                onValueChange={(hour) => onChange({ ...value, hour })}
            >
                <SelectTrigger size={"sm"}>
                    <SelectValue placeholder="時" />
                </SelectTrigger>
                <SelectContent className="max-h-50">
                    {hours.map((h) => (
                        <SelectItem
                            key={h}
                            value={h}
                        >
                            {h}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="font-bold">:</span>
            <Select
                value={value.minute}
                onValueChange={(minute) => onChange({ ...value, minute })}
            >
                <SelectTrigger size={"sm"}>
                    <SelectValue placeholder="分" />
                </SelectTrigger>
                <SelectContent className="max-h-50">
                    {minutes.map((m) => (
                        <SelectItem
                            key={m}
                            value={m}
                        >
                            {m}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
