import { useAtomValue, useSetAtom } from "jotai";
import { createContext, useContext } from "react";

import {
    editTargetCountAtom,
    editTargetCountErrorAtom,
} from "@/atoms/endurances/EditTargetCountAtom";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

type EnduranceContextType = {
    projectStatus: typeof ProjectSchema.Type.status;
    isEdit: boolean;
};

const EnduranceContext = createContext<EnduranceContextType | null>(null);

const useEndurance = () => {
    const ctx = useContext(EnduranceContext);
    if (!ctx) {
        throw new Error(
            "Endurance components must be used within EnduranceView",
        );
    }
    return ctx;
};

type Props = EnduranceContextType & {
    children: React.ReactNode;
};

const EnduranceView = ({ children, ...contextValue }: Props) => {
    return <EnduranceContext value={contextValue}>{children}</EnduranceContext>;
};

type CountProps = {
    currentCount: number;
    targetCount: number;
};

const Count = ({ currentCount, targetCount }: CountProps) => {
    const { isEdit } = useEndurance();
    const setState = useSetAtom(editTargetCountAtom);
    const error = useAtomValue(editTargetCountErrorAtom);

    if (isEdit) {
        return (
            <>
                <label
                    htmlFor="project-title"
                    className="relative flex flex-col items-center"
                >
                    {/* 左上に配置されるキャプション */}
                    <span
                        className="absolute -top-6 -left-6 text-md font-medium
                            text-gray-600"
                    >
                        目標数
                    </span>

                    <div className="flex items-center">
                        <input
                            type="text"
                            className="text-4xl font-mono w-30 text-center
                                outline-none border-b-2 border-gray-300
                                focus:border-gray-500 transition-colors"
                            defaultValue={targetCount}
                            onChange={(e) => setState(Number(e.target.value))}
                        />
                        {error && (
                            <p
                                className="absolute top-full mt-1 text-red-500
                                    text-sm whitespace-nowrap"
                            >
                                {error}
                            </p>
                        )}
                    </div>
                </label>
            </>
        );
    }

    return (
        <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-4xl
                font-mono w-full"
        >
            {/* 左側：右寄せにする */}
            <div className="text-right">{currentCount}</div>

            {/* 中央：スラッシュ（動かない） */}
            <div className="text-5xl text-gray-400">/</div>

            {/* 右側：左寄せにする */}
            <div className="text-left">{targetCount}</div>
        </div>
    );
};

type IncrementButtonProps = {
    onIncrement: () => void;
};

const IncrementButton = ({ onIncrement }: IncrementButtonProps) => {
    const { projectStatus } = useEndurance();

    const isActive = projectStatus === "active";

    return (
        <button
            onClick={onIncrement}
            disabled={!isActive}
            className={` rounded-full px-8 py-3 text-xl font-bold transition ${
                isActive
                    ? "bg-blue-500 hover:bg-blue-600 active:scale-95 text-white"
                    : "bg-gray-400 cursor-not-allowed"
                } `}
        >
            +1
        </button>
    );
};

EnduranceView.Count = Count;
EnduranceView.IncrementButton = IncrementButton;

export default EnduranceView;
