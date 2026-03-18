import { useAtom } from "jotai";

import {
    editUnitLabelAtom,
    editUnitTargetCountAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import type { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";

type Props = {
    unitId: typeof EnduranceUnitsSchema.Type.id;
};

const EditEnduranceUnitRow = ({ unitId }: Props) => {
    const [labelState, setLabel] = useAtom(editUnitLabelAtom(unitId));
    const [targetCountState, setTargetCount] = useAtom(
        editUnitTargetCountAtom(unitId),
    );

    if (!labelState || !targetCountState) {
        return null;
    }

    return (
        <div
            className="flex flex-col items-center justify-center h-35 w-40 gap-8
                rounded-md border border-gray-300 shadow"
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

                <input
                    className="w-30 text-center outline-none border-b-2
                        border-gray-300 focus:border-gray-500 transition-colors"
                    value={labelState.input}
                    placeholder="例: 入室、バッジ"
                    onChange={(e) => setLabel(e.target.value)}
                />
                {labelState.error && (
                    <p className="text-red-600 text-sm">{labelState.error}</p>
                )}
            </label>

            <label
                htmlFor="target-count"
                className="relative flex flex-col items-center"
            >
                {/* 左上に配置されるキャプション */}
                <span
                    className="absolute -top-6 text-md font-medium
                        text-gray-600"
                >
                    目標数
                </span>

                <div className="flex items-center">
                    <input
                        id="target-count"
                        type="text"
                        className="font-mono w-20 text-center outline-none
                            border-b-2 border-gray-300 focus:border-gray-500
                            transition-colors"
                        value={targetCountState.input}
                        onChange={(e) => setTargetCount(e.target.value)}
                    />
                    {targetCountState.error && (
                        <p className="text-red-600 text-sm">
                            {targetCountState.error}
                        </p>
                    )}
                </div>
            </label>
        </div>
    );
};

export default EditEnduranceUnitRow;
