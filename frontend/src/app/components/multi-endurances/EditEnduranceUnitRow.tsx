import { useAtom, useSetAtom } from "jotai";

import {
    deleteUnitAtom,
    editUnitLabelAtom,
    editUnitTargetCountAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div
            className="relative flex flex-col items-center justify-center h-40
                w-40 gap-12 rounded-md border border-gray-300 shadow py-4"
        >
            <label
                htmlFor="label"
                className="relative flex flex-col items-center mt-4"
            >
                <span
                    className="absolute -top-6 text-md font-medium
                        text-gray-600"
                >
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
                {labelState.error && (
                    <p
                        className="absolute top-full mt-1 items-center
                            justify-center text-red-600 text-sm
                            whitespace-nowrap"
                    >
                        {labelState.error}
                    </p>
                )}
            </label>

            <label
                htmlFor="target-count"
                className="relative w-full flex flex-col items-center
                    justify-center"
            >
                {/* 左上に配置されるキャプション */}
                <span
                    className="absolute -top-6 text-md font-medium
                        text-gray-600"
                >
                    目標数
                </span>

                <div className="flex items-center justify-center">
                    <Input
                        id="target-count"
                        type="text"
                        className="font-mono w-20"
                        value={targetCountState.input}
                        aria-invalid={!!targetCountState.error}
                        onChange={(e) => setTargetCount(e.target.value)}
                    />
                    {targetCountState.error && (
                        <p
                            className="absolute top-full mt-1 items-center
                                justify-center text-red-600 text-sm
                                whitespace-nowrap"
                        >
                            {targetCountState.error}
                        </p>
                    )}
                </div>
            </label>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={deleteUnit}
            >
                ✕
            </Button>
        </div>
    );
};

export default EditEnduranceUnitRow;
