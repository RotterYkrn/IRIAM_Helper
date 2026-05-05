import { differenceInMinutes, format } from "date-fns";
import { Match, pipe } from "effect";

import EnterList from "./EnterList";
import InputUserNameField from "./InputUserNameField";

import { Button } from "@/components/ui/button";
import { useActivateEnterUnit } from "@/hooks/enter-endurances/useActivateEnterUnit";
import { useEnterUnitId } from "@/hooks/enter-endurances/useEnterUnitId";
import { useFetchEnterEnduranceUnit } from "@/hooks/enter-endurances/useFetchEnterEnduranceUnit";
import { useFinishEnterUnit } from "@/hooks/enter-endurances/useFinishEnterUnit";
import { formatDurationTime } from "@/utils/formatDurationTime";
import { successToast } from "@/utils/toast";

const EnterEnduranceDetailLayout = () => {
    const unitId = useEnterUnitId();
    const { data, error } = useFetchEnterEnduranceUnit(unitId);
    const activateUnit = useActivateEnterUnit();
    const finishUnit = useFinishEnterUnit();

    if (error) {
        return (
            <div className="flex w-full justify-center">
                通信エラーが発生しました
            </div>
        );
    }

    const handleActivate = () => {
        if (!confirm("入室耐久を開始しますか？")) {
            return;
        }

        activateUnit.mutate(unitId, {
            onSuccess: () => {
                successToast("入室耐久を開始しました");
            },
            onError: () => {
                successToast("入室耐久の開始に失敗しました");
            },
        });
    };

    const handleFinish = () => {
        if (!confirm("入室耐久を終了しますか？")) {
            return;
        }

        finishUnit.mutate(
            { unitId },
            {
                onSuccess: () => {
                    successToast("入室耐久を終了しました");
                },
                onError: () => {
                    successToast("入室耐久の終了に失敗しました");
                },
            },
        );
    };

    return (
        <>
            <div
                className="relative flex flex-col items-center justify-center
                    p-4 gap-4"
            >
                <h1 className="text-3xl font-bold">毎週日曜入室100人耐久</h1>
                <div className="flex flex-col items-center justify-center gap-6">
                    <div
                        className="flex flex-col items-center justify-center
                            gap-2"
                    >
                        <span className="text-xl font-semibold">
                            {format(data.event_date, "yyyy/MM/dd")}
                        </span>
                        <div className="flex gap-4">
                            <span>
                                開始時刻:{" "}
                                {data.started_at
                                    ? format(data.started_at, "MM/dd HH:mm")
                                    : "---"}
                            </span>
                            <span>
                                達成時刻:{" "}
                                {data.completed_at
                                    ? format(data.completed_at, "MM/dd HH:mm")
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
                            <>
                                <Button
                                    className="absolute top-3 right-10
                                        bg-destructive hover:bg-destructive/80"
                                    onClick={handleFinish}
                                >
                                    配信終了
                                </Button>
                                <InputUserNameField
                                    unitId={unitId}
                                    logs={data.logs}
                                />
                            </>
                        )),
                        Match.when({ status: "finished" }, () => null),
                        Match.exhaustive,
                    )}
                    <EnterList logs={data.logs} />
                </div>
            </div>
        </>
    );
};

export default EnterEnduranceDetailLayout;
