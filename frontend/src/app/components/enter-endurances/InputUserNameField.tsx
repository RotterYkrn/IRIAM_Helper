import { Chunk, pipe } from "effect";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import { SendHorizonal } from "lucide-react";
import { useEffect, useEffectEvent, useRef } from "react";

import InputField from "../ui/InputField";

import {
    editEnteredUserNameAtom,
    enteredUserNamesAtom,
    initEditEnteredUserNameAtom,
    isValidEditEnteredUserNameAtom,
    validEditEnteredUserNameAtom,
} from "@/atoms/enter-endurances/EnteredUserNameAtom";
import { Button } from "@/components/ui/button";
import type {
    EnterLogDtoSchema,
    EnterUnitDtoSchema,
} from "@/domain/enter_endurances/dto/EnterUnitDto";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { useLogEnter } from "@/hooks/enter-endurances/useLogEnter";
import { errorToast } from "@/utils/toast";

type Props = {
    unitId: typeof EnterUnitSchema.Type.id;
    logs: typeof EnterUnitDtoSchema.Type.logs;
};

const InputUserNameField = ({ unitId, logs }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const setEnteredUserNames = useSetAtom(enteredUserNamesAtom);
    const initEditEnteredUserName = useSetAtom(initEditEnteredUserNameAtom);
    const [editUserName, setEditUserName] = useAtom(editEnteredUserNameAtom);
    const validEditUserName = useAtomValue(validEditEnteredUserNameAtom);
    const isValid = useAtomValue(isValidEditEnteredUserNameAtom);

    const logEnter = useLogEnter();

    const initEnteredUserNames = useEffectEvent(
        (logs: Chunk.Chunk<typeof EnterLogDtoSchema.Type>) => {
            setEnteredUserNames(
                pipe(
                    logs,
                    Chunk.map((log) => log.user_name),
                ),
            );
        },
    );

    useEffect(() => {
        initEnteredUserNames(logs);
    }, [logs]);

    const handleSubmit = () => {
        if (!validEditUserName) {
            errorToast("ユーザー名が無効です");
            return;
        }

        logEnter.mutate(
            {
                unit_id: unitId,
                user_name: validEditUserName,
                user_number: logs.length + 1,
            },
            {
                onSuccess: () => {
                    initEditEnteredUserName();
                },
                onError: () => {
                    errorToast("入室の記録に失敗しました");
                },
                onSettled: () => {
                    inputRef.current?.focus();
                },
            },
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Ctrl + Enter (Mac の場合は e.metaKey も含めると親切です)
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid) {
            e.preventDefault(); // 改行などのデフォルト挙動を防止
            handleSubmit();
        }
    };

    return (
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
                    onClick={handleSubmit}
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
    );
};

export default InputUserNameField;
