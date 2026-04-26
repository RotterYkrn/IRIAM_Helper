import { useAtom, useSetAtom } from "jotai";

import {
    deleteUnitAtom,
    editUnitLabelAtom,
    editUnitTargetCountAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Card className="relative w-45 h-45">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={deleteUnit}
            >
                ✕
            </Button>

            <Label
                htmlFor="label"
                className="relative"
            >
                <span className="text-md font-medium text-gray-600">
                    耐久対象
                </span>

                <Input
                    id="label"
                    className="w-30"
                    value={labelState.input}
                    placeholder="例: 入室、バッジ"
                    aria-invalid={!!labelState.error}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <p
                    className="absolute top-full w-full text-red-600 text-sm
                        whitespace-nowrap truncate"
                    title={labelState.error || ""}
                >
                    {labelState.error || ""}
                </p>
            </Label>

            <Label
                htmlFor="target-count"
                className="relative"
            >
                {/* 左上に配置されるキャプション */}
                <span className="text-md font-medium text-gray-600">
                    目標数
                </span>

                <Input
                    id="target-count"
                    type="text"
                    className="font-mono w-20"
                    value={targetCountState.input}
                    aria-invalid={!!targetCountState.error}
                    onChange={(e) => setTargetCount(e.target.value)}
                />
                <p
                    className="absolute top-full w-full text-red-600 text-sm
                        whitespace-nowrap truncate"
                    title={targetCountState.error || ""}
                >
                    {targetCountState.error || ""}
                </p>
            </Label>
        </Card>
    );
};

export default EditEnduranceUnitRow;
