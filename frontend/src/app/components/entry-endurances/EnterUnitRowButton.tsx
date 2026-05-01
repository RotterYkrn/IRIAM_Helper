import { format } from "date-fns";
import { Option } from "effect";

import { Button } from "@/components/ui/button";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";

type Props =
    | {
          type: "none";
          event_date: Date;
          enter_count: null;
          durationTime: Option.None<Date>;
          onClick: () => void;
      }
    | {
          type: "existing";
          event_date: Date;
          enter_count: typeof EnterUnitSchema.Type.enter_count;
          durationTime: Option.Option<Date>;
          onClick: () => void;
      };

const EnterUnitRowButton = ({
    event_date,
    enter_count,
    durationTime,
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
                    {Option.isSome(durationTime)
                        ? format(durationTime.value, "HH時間mm分")
                        : "記録なし"}
                </div>
            </div>
        </Button>
    );
};

export default EnterUnitRowButton;
