import { Chunk, pipe } from "effect";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import { useEffect, useEffectEvent } from "react";

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

    const handleSend = () => {
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
            },
        );
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <InputField
                value={editUserName.input}
                error={editUserName.error}
                setValue={(value) => setEditUserName(value)}
                placeholder="入室したユーザー..."
                className="w-50 text-lg px-1"
            />
            <Button
                disabled={!isValid}
                onClick={handleSend}
            >
                登録
            </Button>
        </div>
    );
};

export default InputUserNameField;
