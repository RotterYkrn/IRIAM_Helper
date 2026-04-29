import { useAtom, useSetAtom } from "jotai";

import InputField from "../ui/InputField";

import {
    deleteUnitAtom,
    editUnitLabelAtom,
    editUnitTargetCountAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";

type Props = {
    unitId: typeof EnduranceUnitsSchema.Type.id;
};

const EditEnduranceUnitRow = ({ unitId }: Props) => {
    const [labelState, setLabel] = useAtom(editUnitLabelAtom(unitId));
    const [targetCountState, setTargetCount] = useAtom(
        editUnitTargetCountAtom(unitId),
    );
    const deleteUnit = useSetAtom(deleteUnitAtom(unitId));

    if (!labelState || !targetCountState) {
        return null;
    }

    return (
        <Card className="relative w-40 h-40 pt-2 gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={deleteUnit}
            >
                ✕
            </Button>

            <InputField
                label="耐久対象"
                value={labelState.input}
                error={labelState.error}
                setValue={setLabel}
                placeholder="例: 入室、バッジ"
                className="w-30"
            />

            <InputField
                label="目標数"
                value={targetCountState.input}
                error={targetCountState.error}
                setValue={setTargetCount}
                className="w-20 font-mono"
            />
        </Card>
    );
};

export default EditEnduranceUnitRow;
