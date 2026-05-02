import { format } from "date-fns";
import { Option, pipe } from "effect";

import { Button } from "@/components/ui/button";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";

type Props = {
    event_date: typeof EnterUnitSchema.Type.event_date;
    enter_count?: typeof EnterUnitSchema.Type.enter_count | null;
    durationMinute?: Option.Option<number>;
    isToday: boolean;
    isBeforeDay: boolean;
    onClick: () => void;
};

const EnterUnitRowButton = ({
    event_date,
    enter_count = null,
    durationMinute = Option.none(),
    isToday,
    isBeforeDay,
    onClick,
}: Props) => {
    return (
        <Button
            variant="ghost"
            size="lg"
            disabled={!isBeforeDay && !isToday}
            onClick={onClick}
            className="border-b px-0 active:scale-none"
        >
            <div className="grid grid-cols-3 w-full p-4 items-center
                text-center">
                <div className="relative text-sm">
                    {isToday && (
                        <span className="absolute left-0 text-destructive">
                            今日
                        </span>
                    )}
                    <span>{format(event_date, "yyyy/MM/dd")}</span>
                </div>
                <div>
                    <span className="text-sm">
                        {enter_count != null ? enter_count : "---"}
                    </span>
                    <span className="text-xs ml-1">人</span>
                </div>
                <div className="text-sm">
                    {Option.isSome(durationMinute)
                        ? pipe(
                              durationMinute.value,
                              (min) => ({
                                  hours: Math.floor(min / 60),
                                  minutes: min % 60,
                              }),
                              ({ hours, minutes }) =>
                                  `${hours}時間${minutes.toString().padStart(2, "0")}分`,
                          )
                        : "記録なし"}
                </div>
            </div>
        </Button>
    );
};

export default EnterUnitRowButton;
