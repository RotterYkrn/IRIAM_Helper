import { format } from "date-fns";
import { Chunk } from "effect";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { EnterLogDtoSchema } from "@/domain/enter_endurances/dto/EnterUnitDto";

interface EntryListProps {
    logs: Chunk.Chunk<typeof EnterLogDtoSchema.Type>;
}

const EnterList = ({ logs }: EntryListProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-lg font-semibold">入室者一覧</span>
            <div
                className="flex flex-col items-center justify-center max-h-100
                    overflow-auto w-lg rounded-md border px-2"
            >
                <Table className="rounded-md">
                    <TableHeader>
                        <TableRow className="bg-white z-10">
                            <TableHead className="w-15 text-center">
                                番号
                            </TableHead>
                            <TableHead>名前</TableHead>
                            <TableHead className="w-40">入室時刻</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Chunk.isNonEmpty(logs) ? (
                            Chunk.map(logs, (log) => (
                                <TableRow key={log.user_number}>
                                    <TableCell className="text-center">
                                        {log.user_number}
                                    </TableCell>
                                    <TableCell>{log.user_name}</TableCell>
                                    <TableCell>
                                        {format(
                                            log.entered_at,
                                            "yyyy/MM/dd HH:mm",
                                        )}
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
