import { format } from "date-fns";
import { Option, pipe } from "effect";

import { Button } from "@/components/ui/button";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";

type Props =
    | {
          type: "none";
          event_date: Date;
          enter_count: null;
          durationMinute: Option.None<number>;
          onClick: () => void;
      }
    | {
          type: "existing";
          event_date: Date;
          enter_count: typeof EnterUnitSchema.Type.enter_count;
          durationMinute: Option.Option<number>;
          onClick: () => void;
      };

const EnterUnitRowButton = ({
    event_date,
    enter_count,
    durationMinute,
    onClick,
}: Props) => {
    return (
        <Button
            variant="ghost"
            size="lg"
            onClick={onClick}
            className="border-b px-0 active:scale-none"
        >
            <div className="grid grid-cols-3 w-full p-4 items-center
                text-center">
                <span className="text-sm">
                    {format(event_date, "yyyy/MM/dd")}
                </span>
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
