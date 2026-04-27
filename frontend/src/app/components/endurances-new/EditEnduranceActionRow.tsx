import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";

import EnduranceView from "../ui/EnduranceView";
import InputField from "../ui/InputField";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";

type Props = {
    actionId: typeof EnduranceActionsNewSchema.Type.id;
    actionType: typeof EnduranceActionsNewSchema.Type.type;
};

/**
 * 耐久企画の救済・妨害アクションの各要素の編集フォームを描画します
 *
 * @note {@link EnduranceView} 内で使用する必要があります。
 */
const EditEnduranceActionRow = ({ actionId, actionType }: Props) => {
    const editActionsAtom = useMemo(
        () =>
            actionType === "rescue"
                ? editRescueActionsAtomsNew
                : editSabotageActionsAtomsNew,
        [actionType],
    );

    const [labelState, setLabel] = useAtom(editActionsAtom.editLabel(actionId));
    const [amountState, setAmount] = useAtom(
        editActionsAtom.editAmount(actionId),
    );
    const deleteAction = useSetAtom(editActionsAtom.deleteAction(actionId));

    if (!labelState || !amountState || !deleteAction) {
        return null;
    }

    const labelPlaceholder = actionType === "rescue" ? "救済行為" : "妨害行為";

    return (
        <Card className="relative w-30 h-30 gap-2">
            <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-1 right-1"
                onClick={deleteAction}
            >
                ✕
            </Button>

            <InputField
                value={labelState.input}
                error={labelState.error}
                setValue={setLabel}
                placeholder={labelPlaceholder}
                className="w-20"
            />
            <InputField
                value={amountState.input}
                error={amountState.error}
                setValue={setAmount}
                placeholder="カウント数"
                className="w-20 font-mono"
            />
        </Card>
    );
};

export default EditEnduranceActionRow;
