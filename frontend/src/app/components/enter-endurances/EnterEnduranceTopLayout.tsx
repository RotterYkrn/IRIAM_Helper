import {
    addMonths,
    subMonths,
    isBefore,
    isAfter,
    isSameMonth,
    format,
    startOfMonth,
    parse,
    eachDayOfInterval,
    endOfMonth,
    isSameDay,
    differenceInMinutes,
    max,
    startOfDay,
} from "date-fns";
import { Chunk, Match, Option, pipe } from "effect";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EnterUnitRowButton from "./EnterUnitRowButton";

import { Button } from "@/components/ui/button";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { useCreateEnterUnit } from "@/hooks/enter-endurances/useCreateEnterUnit";
import { useFetchEnterEnduranceProject } from "@/hooks/enter-endurances/useFetchEnterEnduranceProject";
import { errorToast } from "@/utils/toast";

const START_DATE = new Date(2026, 3, 19);
const TODAY = new Date();

type Props = {
    projectId: typeof ProjectSchema.Type.id;
};

const EnterEnduranceTopLayout = ({ projectId }: Props) => {
    const navigate = useNavigate();
    const { data, isError } = useFetchEnterEnduranceProject(projectId);
    const createEnterUnit = useCreateEnterUnit();

    const [searchParams, setSearchParams] = useSearchParams();
    const monthParam = searchParams.get("month");
    const viewMonth = monthParam
        ? parse(monthParam, "yyyy-MM", new Date())
        : startOfMonth(TODAY);

    const filteredUnits = useMemo(
        () =>
            pipe(
                {
                    start: max([viewMonth, START_DATE]),
                    end: endOfMonth(viewMonth),
                },
                ({ start, end }) =>
                    eachDayOfInterval({ start, end })
                        .filter((date) => date.getDay() === 0)
                        .map((date) => startOfDay(date)),
                Chunk.fromIterable,
                Chunk.map((date) =>
                    pipe(
                        data.units,
                        Chunk.findFirst((unit) =>
                            isSameDay(unit.event_date, date),
                        ),
                        Option.match({
                            onSome: (unit) => ({
                                ...unit,
                                type: "existing" as const,
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
                            }),
                            onNone: () => ({
                                type: "none" as const,
                                event_date: date,
                            }),
                        }),
                    ),
                ),
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

    const onClickExisting = (unitId: typeof EnterUnitSchema.Type.id) => () => {
        navigate(`/enter-endurance/${unitId}`);
    };

    const onClickNone = (eventDate: Date) => () => {
        console.log("onClickNone", eventDate);
        createEnterUnit.mutate(
            { project_id: projectId, event_date: eventDate },
            {
                onSuccess: (unitId) => {
                    navigate(`/enter-endurance/${unitId}`);
                },
                onError: () => {
                    errorToast(
                        `${format(eventDate, "yyyy/MM/dd")} のデータの作成に失敗しました`,
                    );
                },
            },
        );
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
                    {Chunk.map(filteredUnits, (unit) =>
                        pipe(
                            unit,
                            Match.value,
                            Match.when({ type: "existing" }, (unit) => (
                                <EnterUnitRowButton
                                    key={unit.id}
                                    event_date={unit.event_date}
                                    enter_count={unit.enter_count}
                                    durationMinute={unit.durationTime}
                                    isToday={isSameDay(unit.event_date, TODAY)}
                                    isBeforeDay={isBefore(
                                        unit.event_date,
                                        TODAY,
                                    )}
                                    onClick={onClickExisting(unit.id)}
                                />
                            )),
                            Match.when({ type: "none" }, (unit) => (
                                <EnterUnitRowButton
                                    key={unit.event_date.toString()}
                                    event_date={unit.event_date}
                                    enter_count={null}
                                    durationMinute={Option.none()}
                                    isToday={isSameDay(unit.event_date, TODAY)}
                                    isBeforeDay={isBefore(
                                        unit.event_date,
                                        TODAY,
                                    )}
                                    onClick={onClickNone(unit.event_date)}
                                />
                            )),
                            Match.exhaustive,
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnterEnduranceTopLayout;
