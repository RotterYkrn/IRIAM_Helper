import { useAtom, useSetAtom } from "jotai";
import { createContext, useContext, useEffect } from "react";

import {
    editEnduranceSettingsAtom,
    initializeEditEnduranceSettingsAtom,
} from "@/atoms/EditEnduranceSettingsAtom";

type EnduranceContextType = {
    currentCount: number;
    targetCount: number;
    isActive: boolean;
    isEdit: boolean;
    onIncrement: () => void;
};

const EnduranceContext = createContext<EnduranceContextType | null>(null);

const useEndurance = () => {
    const ctx = useContext(EnduranceContext);
    if (!ctx) {
        throw new Error("Endurance components must be used within Endurance");
    }
    return ctx;
};

type Props = EnduranceContextType & {
    children: React.ReactNode;
};

const Endurance = ({ children, ...contextValue }: Props) => {
    return <EnduranceContext value={contextValue}>{children}</EnduranceContext>;
};

const Count = () => {
    const { isEdit, currentCount, targetCount } = useEndurance();

    if (isEdit) {
        return null;
    }

    return (
        <div className="text-4xl font-mono">
            {currentCount} / {targetCount}
        </div>
    );
};

const Editor = () => {
    const { targetCount, isEdit } = useEndurance();

    const [state, setState] = useAtom(editEnduranceSettingsAtom);
    const initEdit = useSetAtom(initializeEditEnduranceSettingsAtom);

    useEffect(() => {
        initEdit({
            targetCount: targetCount,
        });
    }, [initEdit, targetCount]);

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

const IncrementButton = () => {
    const { isActive, onIncrement } = useEndurance();
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

Endurance.Count = Count;
Endurance.Editor = Editor;
Endurance.IncrementButton = IncrementButton;

export default Endurance;
