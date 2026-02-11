import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";

import { editRescueActionsAtoms } from "@/atoms/endurances/EditActionAtom";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";

const RescueRow = ({ id }: { id: typeof EnduranceActionsSchema.Type.id }) => {
    const [label, setLabel] = useAtom(
        useMemo(() => editRescueActionsAtoms.editLabel(id), [id]),
    );
    const [amount, setAmount] = useAtom(
        useMemo(() => editRescueActionsAtoms.editAmount(id), [id]),
    );
    const deleteRescue = useSetAtom(
        useMemo(() => editRescueActionsAtoms.deleteAction(id), [id]),
    );

    return (
        <div className="border p-3 space-y-2">
            {/* LABEL */}
            <div>
                <input
                    defaultValue={label.value}
                    placeholder="初見、ギフト名など"
                    onChange={(e) => setLabel(e.target.value)}
                />
                {label.error && (
                    <p className="text-red-600 text-sm">{label.error}</p>
                )}
            </div>

            {/* AMOUNT */}
            <div>
                <input
                    defaultValue={amount.value}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                {amount.error && (
                    <p className="text-red-600 text-sm">{amount.error}</p>
                )}
            </div>

            <button onClick={deleteRescue}>削除</button>
        </div>
    );
};

export default RescueRow;
