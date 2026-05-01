import {
    addMonths,
    subMonths,
    isBefore,
    isAfter,
    isSameMonth,
    format,
    startOfMonth,
    differenceInMinutes,
    parse,
} from "date-fns";
import { Chunk, pipe, Option, Schema } from "effect";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EnterUnitRowButton from "./EnterUnitRowButton";

import { Button } from "@/components/ui/button";
import { EnterProjectDtoSchema } from "@/domain/enter_endurances/dto/EnterProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { useFetchEnterEnduranceProject } from "@/hooks/enter-endurances/useFetchEnterEnduranceProject";

const START_DATE = new Date(2026, 3, 19);
const TODAY = new Date();

const mockUnits = Schema.decodeSync(EnterProjectDtoSchema)({
    id: crypto.randomUUID(),
    title: "Test Project",
    units: [
        {
            id: crypto.randomUUID(),
            status: "scheduled",
            event_date: new Date(2026, 3, 19).toString(),
            enter_count: 10,
            started_at: new Date(2026, 3, 19).toString(),
            completed_at: new Date(2026, 3, 20).toString(),
        },
    ],
});

type Props = {
    projectId: typeof ProjectSchema.Type.id;
};

const EnterEnduranceTopLayout = ({ projectId }: Props) => {
    const navigate = useNavigate();
    const { data, isError } = useFetchEnterEnduranceProject(projectId);
    const [searchParams, setSearchParams] = useSearchParams();

    const monthParam = searchParams.get("month");
    const viewMonth = monthParam
        ? parse(monthParam, "yyyy-MM", new Date())
        : startOfMonth(TODAY);

    const filteredUnits = useMemo(
        () =>
            pipe(
                mockUnits.units,
                Chunk.filter((unit) => isSameMonth(unit.event_date, viewMonth)),
                Chunk.map((unit) => ({
                    ...unit,
                    durationTime:
                        unit.completed_at && unit.started_at
                            ? pipe(
                                  differenceInMinutes(
                                      unit.completed_at,
                                      unit.started_at,
                                  ),
                                  Option.some,
                              )
                            : Option.none(),
                })),
            ),
        [data.units, viewMonth],
    );

    if (isError) {
        return (
            <div className="flex w-full justify-center">
                通信エラーが発生しました
            </div>
        );
    }

    const minMonth = startOfMonth(START_DATE);
    const maxMonth = startOfMonth(TODAY);

    const canGoBack = isAfter(viewMonth, minMonth);
    const canGoForward =
        isBefore(viewMonth, maxMonth) && !isSameMonth(viewMonth, maxMonth);

    const handleChangeMonth = (newDate: Date) => {
        setSearchParams({ month: format(newDate, "yyyy-MM") });
    };

    return (
        <div
            className="flex flex-col items-center justify-center w-lg p-4
                space-y-4"
        >
            <div className="flex w-xs items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleChangeMonth(subMonths(viewMonth, 1))}
                    disabled={!canGoBack}
                >
                    <ChevronLeft />
                </Button>

                <div className="text-lg font-semibold">
                    {format(viewMonth, "yyyy年 MM月")}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleChangeMonth(addMonths(viewMonth, 1))}
                    disabled={!canGoForward}
                >
                    <ChevronRight />
                </Button>
            </div>

            <div
                className="w-full max-w-2xl mx-auto border rounded-md
                    overflow-hidden bg-white shadow"
            >
                <div
                    className="grid grid-cols-3 bg-pink-50 px-4 py-2 text-sm
                        font-medium text-muted-foreground text-center"
                >
                    <div>実施日</div>
                    <div>入室人数</div>
                    <div>達成時間</div>
                </div>

                <div className="flex flex-col">
                    {Chunk.map(filteredUnits, (unit) => (
                        <EnterUnitRowButton
                            key={unit.id}
                            type="existing"
                            event_date={unit.event_date}
                            enter_count={unit.enter_count}
                            durationMinute={unit.durationTime}
                            onClick={() =>
                                navigate(`/enter-endurance/${unit.id}`)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnterEnduranceTopLayout;
