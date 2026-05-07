import { format } from "date-fns";
import { Chunk, Match, Order, pipe } from "effect";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { EnterLogDtoSchema } from "@/domain/enter_endurances/dto/EnterUnitDto";

type SortOrder = "asc" | "desc";

interface EntryListProps {
    logs: Chunk.Chunk<typeof EnterLogDtoSchema.Type>;
}

const EnterList = ({ logs }: EntryListProps) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const sortedLogs = useMemo(
        () =>
            pipe(
                Match.value(sortOrder),
                Match.when("asc", () =>
                    Chunk.sort(
                        logs,
                        Order.mapInput(
                            Order.number,
                            (log: typeof EnterLogDtoSchema.Type) =>
                                log.user_number,
                        ),
                    ),
                ),
                Match.when("desc", () =>
                    Chunk.sort(
                        logs,
                        Order.mapInput(
                            Order.number,
                            (log: typeof EnterLogDtoSchema.Type) =>
                                -log.user_number,
                        ),
                    ),
                ),
                Match.exhaustive,
            ),
        [logs, sortOrder],
    );

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-lg font-semibold">入室者一覧</span>
            <div
                className="max-h-100 overflow-auto w-md rounded-md border
                    border-pink-100 shadow px-2"
            >
                <Table className="rounded-md">
                    <TableHeader>
                        <TableRow className="bg-white border-pink-200 z-10">
                            <TableHead className="w-15 text-center">
                                <div
                                    className="flex items-center justify-center"
                                >
                                    番号
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() =>
                                            setSortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc",
                                            )
                                        }
                                    >
                                        <ArrowUpDown />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead>名前</TableHead>
                            <TableHead className="w-25">入室時刻</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Chunk.isNonEmpty(sortedLogs) ? (
                            Chunk.map(sortedLogs, (log) => (
                                <TableRow
                                    key={log.user_number}
                                    className="border-pink-200"
                                >
                                    <TableCell className="text-center">
                                        {log.user_number}
                                    </TableCell>
                                    <TableCell>{log.user_name}</TableCell>
                                    <TableCell>
                                        {format(log.entered_at, "HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="h-15 text-center"
                                >
                                    未登録
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default EnterList;
