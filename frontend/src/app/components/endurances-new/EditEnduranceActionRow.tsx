import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";

import EnduranceView from "../ui/EnduranceView";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import { Button } from "@/components/ui/button";
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

    return (
        <EnduranceView.Action>
            <EnduranceView.EditSettingsLayout>
                <EnduranceView.EditLabel
                    labelState={labelState}
                    setLabel={setLabel}
                />
                <EnduranceView.EditAmount
                    amountState={amountState}
                    setAmount={setAmount}
                />

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={deleteAction}
                >
                    ✕
                </Button>
            </EnduranceView.EditSettingsLayout>
        </EnduranceView.Action>
    );
};

export default EditEnduranceActionRow;
