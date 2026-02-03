import { useAtom } from "jotai";
import { createContext, useContext } from "react";

import { editEnduranceSettingsAtom } from "@/atoms/EditEnduranceSettingsAtom";
import type { ProjectSchema } from "@/domain/projects/Project";

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
    const [state, setState] = useAtom(editEnduranceSettingsAtom);

    if (isEdit) {
        return (
            <input
                type="text"
                className="text-4xl font-mono w-1/4 text-center outline-none
                    border-b-2 border-gray-300 focus:border-gray-500
                    transition-colors"
                defaultValue={state.targetCount}
                onChange={(e) =>
                    setState({
                        ...state,
                        targetCount: Number(e.target.value),
                    })
                }
            />
        );
    }

    return (
        <div className="text-4xl font-mono">
            {currentCount} / {targetCount}
        </div>
    );
};

const Editor = () => {
    const { isEdit } = useEndurance();
    const [state, setState] = useAtom(editEnduranceSettingsAtom);

    if (!isEdit) {
        return null;
    }

    return (
        <label className="flex flex-col gap-2">
            目標数
            <input
                type="number"
                className="border px-3 py-2"
                value={state.targetCount}
                onChange={(e) =>
                    setState({
                        ...state,
                        targetCount: Number(e.target.value),
                    })
                }
            />
        </label>
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
            className={` rounded-full px-10 py-4 text-xl font-bold transition ${
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
EnduranceView.Editor = Editor;
EnduranceView.IncrementButton = IncrementButton;

export default EnduranceView;
