import { Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";

import RescueRow from "./RescueRow";

import { editRescueActionsAtoms } from "@/atoms/endurances/EditActionAtom";

const RescueEditSection = () => {
    const rescues = useAtomValue(editRescueActionsAtoms.editActions);
    const createRescue = useSetAtom(editRescueActionsAtoms.createAction);

    const addRow = () => {
        createRescue();
    };

    return (
        <div className="space-y-4 border p-4">
            <div className="flex justify-between items-center">
                <h2>救済アクション</h2>
                <button onClick={addRow}>＋追加</button>
            </div>

            {Chunk.map(rescues, (action) => (
                <RescueRow
                    key={action.id}
                    id={action.id}
                />
            ))}
        </div>
    );
};

export default RescueEditSection;
