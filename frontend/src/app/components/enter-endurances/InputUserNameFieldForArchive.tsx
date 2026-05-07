import { addHours, addMinutes, startOfDay } from "date-fns";
import { Chunk } from "effect";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import { SendHorizonal } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { DatePicker } from "../ui/DatePicker";
import InputField from "../ui/InputField";
import { TimePicker } from "../ui/TimePicker";

import {
    editCompletedAtAtom,
    editStartedAtAtom,
} from "@/atoms/enter-endurances/ArchiveEnterEnduranceDateAtom";
import {
    editEnteredUserNameAtom,
    enterLogsAtom,
    initEditEnteredUserNameAtom,
    isValidEditEnteredUserNameAtom,
    validEditEnteredUserNameAtom,
} from "@/atoms/enter-endurances/EnteredUserNameAtom";
import { Button } from "@/components/ui/button";
import { useArchiveEnterLogs } from "@/hooks/enter-endurances/useArchiveEnterLogs";
import { useEnterUnitId } from "@/hooks/enter-endurances/useEnterUnitId";
import { errorToast, successToast } from "@/utils/toast";

const InputEnterArchiveData = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const unitId = useEnterUnitId();
    const archiveEnterLogs = useArchiveEnterLogs();

    const [enterLogs, setEnterLogs] = useAtom(enterLogsAtom);
    const initEditEnteredUserName = useSetAtom(initEditEnteredUserNameAtom);
    const [editUserName, setEditUserName] = useAtom(editEnteredUserNameAtom);
    const validEditUserName = useAtomValue(validEditEnteredUserNameAtom);
    const isValid = useAtomValue(isValidEditEnteredUserNameAtom);

    const [startedAt, setStartedAt] = useAtom(editStartedAtAtom);
    const [completedAt, setCompletedAt] = useAtom(editCompletedAtAtom);
    const [startedDate, setStartedDate] = useState<Date | undefined>(
        startOfDay(new Date()),
    );
    const [startedTime, setStartedTime] = useState<{
        hour: string;
        minute: string;
    }>({ hour: "00", minute: "00" });
    const [completeTime, setCompleteTime] = useState<{
        hour: string;
        minute: string;
    }>({ hour: "00", minute: "00" });

    const initEnterLogs = useEffectEvent(() => {
        setEnterLogs(Chunk.empty());
    });

    useEffect(() => {
        initEnterLogs();
    }, []);

    const setEnterUnitDateTime = useEffectEvent(
        (
            stDate: Date,
            stTime: { hour: string; minute: string },
            cmpTime: { hour: string; minute: string },
        ) => {
            const stTimeInt = {
                hour: parseInt(stTime.hour, 10),
                minute: parseInt(stTime.minute, 10),
            };
            const cmpTimeInt = {
                hour: parseInt(cmpTime.hour, 10),
                minute: parseInt(cmpTime.minute, 10),
            };

            const startDateTime = addHours(
                addMinutes(stDate, stTimeInt.minute),
                stTimeInt.hour,
            );
            const completedDateTime = addHours(
                addMinutes(startDateTime, cmpTimeInt.minute),
                cmpTimeInt.hour,
            );
            setStartedAt(startDateTime);
            setCompletedAt(completedDateTime);
        },
    );

    useEffect(() => {
        if (startedDate) {
            setEnterUnitDateTime(startedDate, startedTime, completeTime);
        }
    }, [startedDate, startedTime, completeTime]);

    const handleAdd = () => {
        if (!validEditUserName) {
            errorToast("ユーザー名が無効です");
            return;
        }

        if (!startedAt || !completedAt) {
            errorToast("開始時刻と達成時間を入力してください");
            return;
        }

        setEnterLogs((prev) =>
            Chunk.append(prev, {
                user_number: prev.length + 1,
                user_name: validEditUserName,
                entered_at: completedAt,
            }),
        );

        initEditEnteredUserName();
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid) {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleSubmit = () => {
        if (!confirm("記録を確定しますか？")) {
            return;
        }

        archiveEnterLogs.mutate(
            {
                unit_id: unitId,
                enter_count: enterLogs.length,
                started_at: startedAt!,
                completed_at: completedAt!,
                logs: enterLogs,
            },
            {
                onSuccess: () => {
                    successToast("記録を保存しました");
                },
                onError: () => {
                    errorToast("記録の保存に失敗しました");
                },
            },
        );
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-4">
                <span>開始時刻:</span>
                <DatePicker
                    date={startedDate}
                    setDate={setStartedDate}
                />
                <TimePicker
                    value={startedTime}
                    onChange={setStartedTime}
                />
            </div>
            <div className="flex items-center justify-center gap-4">
                <span>達成時間:</span>
                <TimePicker
                    value={completeTime}
                    onChange={setCompleteTime}
                />
            </div>
            <div className="flex items-center justify-center gap-6">
                <InputField
                    ref={inputRef}
                    className="w-50 text-lg px-1"
                    value={editUserName.input}
                    error={editUserName.error}
                    setValue={(value) => setEditUserName(value)}
                    placeholder="入室したユーザー..."
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className="relative">
                    <Button
                        size={"icon"}
                        className="bg-sky-500 hover:bg-sky-500/80"
                        disabled={!isValid}
                        onClick={handleAdd}
                    >
                        <SendHorizonal />
                    </Button>
                    <span
                        className="absolute top-full left-1/2 -translate-x-1/2
                            text-xs text-muted-foreground font-semibold
                            whitespace-nowrap"
                    >
                        Ctrl + Enter
                    </span>
                </div>
            </div>
            <Button
                variant={"outline"}
                size={"lg"}
                onClick={handleSubmit}
            >
                記録を確定する
            </Button>
        </div>
    );
};

export default InputEnterArchiveData;
