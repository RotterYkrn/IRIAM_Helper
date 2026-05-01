import {
    addMonths,
    subMonths,
    isBefore,
    isAfter,
    isSameMonth,
    format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
// 仮データ
const mockSessions = [
    {
        id: "1",
        session_date: "2026-04-12",
        total_entries: 124,
        duration_minutes: 95,
    },
    {
        id: "2",
        session_date: "2026-04-19",
        total_entries: 102,
        duration_minutes: 120,
    },
];

// 経過時間を「◯時間◯分」に変換するヘルパー
const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const m2 = m.toString().padStart(2, "0");
    return h > 0 ? `${h}時間${m2}分` : `${m2}分`;
};

const EnterEnduranceTopLayout = () => {
    const [viewDate, setViewDate] = useState(new Date());

    const minDate = new Date(2026, 4, 1);
    const maxDate = new Date();

    const canGoBack = isAfter(subMonths(viewDate, 0), minDate);
    const canGoForward =
        isBefore(viewDate, maxDate) && !isSameMonth(viewDate, maxDate);

    const filteredSessions = useMemo(() => {
        return mockSessions.filter((session) => {
            const sessionDate = new Date(session.session_date);
            return isSameMonth(sessionDate, viewDate);
        });
    }, [viewDate]);

    return (
        <div
            className="flex flex-col items-center justify-center w-lg p-4
                space-y-4"
        >
            {/* 月の切り替えナビゲーション */}
            <div className="flex w-xs items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewDate(subMonths(viewDate, 1))}
                    disabled={!canGoBack}
                >
                    <ChevronLeft />
                </Button>

                <div className="text-lg font-semibold">
                    {format(viewDate, "yyyy年 MM月")}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewDate(addMonths(viewDate, 1))}
                    disabled={!canGoForward}
                >
                    <ChevronRight />
                </Button>
            </div>

            {/* セッション一覧 */}
            <div
                className="w-full max-w-2xl mx-auto border rounded-md
                    overflow-hidden bg-white shadow"
            >
                {/* ヘッダー部分 */}
                <div
                    className="grid grid-cols-3 bg-pink-50 px-4 py-2 text-sm
                        font-medium text-muted-foreground text-center"
                >
                    <div>実施日</div>
                    <div>入室人数</div>
                    <div>達成時間</div>
                </div>

                {/* 行（ボタン）一覧 */}
                <div className="flex flex-col">
                    {mockSessions.map((session) => (
                        <Button
                            key={session.id}
                            variant="ghost"
                            size="lg"
                            asChild
                            className="border-b px-0 active:scale-none"
                        >
                            <Link
                                to={`/projects/endurance/sessions/${session.id}`}
                            >
                                <div
                                    className="grid grid-cols-3 w-full px-4 py-4
                                        items-center text-center"
                                >
                                    {/* 日付 */}
                                    <span className="text-sm">
                                        {format(
                                            new Date(session.session_date),
                                            "yyyy/MM/dd",
                                        )}
                                    </span>

                                    {/* 入室人数 */}
                                    <div className="text-sm">
                                        <span>{session.total_entries}</span>
                                        <span className="text-xs ml-1">人</span>
                                    </div>

                                    {/* 経過時間 */}
                                    <div className="text-sm">
                                        {formatDuration(
                                            session.duration_minutes,
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnterEnduranceTopLayout;
