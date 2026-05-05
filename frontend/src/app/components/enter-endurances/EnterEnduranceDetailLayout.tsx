import { differenceInMinutes, format } from "date-fns";
import { Match, pipe } from "effect";

import EnterList from "./EnterList";
import InputUserNameField from "./InputUserNameField";

import { Button } from "@/components/ui/button";
import { useActivateEnterUnit } from "@/hooks/enter-endurances/useActivateEnterUnit";
import { useEnterUnitId } from "@/hooks/enter-endurances/useEnterUnitId";
import { useFetchEnterEnduranceUnit } from "@/hooks/enter-endurances/useFetchEnterEnduranceUnit";
import { formatDurationTime } from "@/utils/formatDurationTime";
import { successToast } from "@/utils/toast";

const EnterEnduranceDetailLayout = () => {
    const unitId = useEnterUnitId();
    const { data, error } = useFetchEnterEnduranceUnit(unitId);
    const activateUnit = useActivateEnterUnit();

    if (error) {
        return (
            <div className="flex w-full justify-center">
                通信エラーが発生しました
            </div>
        );
    }

    const handleActivate = () => {
        activateUnit.mutate(unitId, {
            onSuccess: () => {
                successToast("入室耐久を開始しました");
            },
            onError: () => {
                successToast("入室耐久の開始に失敗しました");
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-xl font-semibold">
                    {format(data.event_date, "yyyy/MM/dd")}
                </span>
                <div className="flex gap-4">
                    <span>
                        開始時刻:{" "}
                        {data.started_at
                            ? format(data.started_at, "HH:mm")
                            : "---"}
                    </span>
                    <span>
                        達成時刻:{" "}
                        {data.completed_at
                            ? format(data.completed_at, "HH:mm")
                            : "---"}
                    </span>
                </div>
                <span>
                    達成時間:{" "}
                    {data.started_at && data.completed_at
                        ? pipe(
                              differenceInMinutes(
                                  data.completed_at,
                                  data.started_at,
                              ),
                              formatDurationTime,
                          )
                        : "---"}
                </span>
            </div>
            {Match.value(data).pipe(
                Match.when({ status: "scheduled" }, () => (
                    <Button
                        size={"lg"}
                        className="bg-green-500 hover:bg-green-500/70"
                        onClick={handleActivate}
                    >
                        配信開始
                    </Button>
                )),
                Match.when({ status: "active" }, () => (
                    <InputUserNameField
                        unitId={unitId}
                        logs={data.logs}
                    />
                )),
                Match.when({ status: "finished" }, () => null),
                Match.exhaustive,
            )}
            <EnterList logs={data.logs} />
        </div>
    );
};

export default EnterEnduranceDetailLayout;
