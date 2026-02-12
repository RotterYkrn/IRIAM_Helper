import { Chunk } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createContext, useContext, useMemo } from "react";

import { editRescueActionsAtoms } from "@/atoms/endurances/EditActionAtom";
import {
    editTargetCountAtom,
    editTargetCountErrorAtom,
} from "@/atoms/endurances/EditTargetCountAtom";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import type { EnduranceRescueActionChunkSchema } from "@/domain/endurances/views/EnduranceActionStatsView";
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

const ActionsField = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

type RescueActionsFieldProps = {
    actions: typeof EnduranceRescueActionChunkSchema.Type;
};

const RescueActionsField = ({ actions }: RescueActionsFieldProps) => {
    const { isEdit } = useEndurance();
    const state = useAtomValue(editRescueActionsAtoms.editActions);
    const createAction = useSetAtom(editRescueActionsAtoms.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (isEdit) {
        return (
            <div className="space-y-4 border p-4">
                <div className="flex justify-between items-center">
                    <h2>救済</h2>
                    <button onClick={onAddAction}>＋追加</button>
                </div>
                {Chunk.map(state, (action) => (
                    <Action
                        key={action.id}
                        id={action.id}
                        label={action.label}
                        amount={action.amount}
                    />
                ))}
            </div>
        );
    }

    if (state.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 border p-4">
            <div className="flex justify-between items-center">
                <h2>救済</h2>
            </div>
            {Chunk.map(actions, (action) => (
                <Action
                    key={action.id}
                    id={action.id}
                    label={action.label}
                    amount={action.amount}
                />
            ))}
        </div>
    );
};

type ActionProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    label: typeof EnduranceActionsSchema.Type.label;
    amount: typeof EnduranceActionsSchema.Type.amount;
};

const Action = ({ id, label, amount }: ActionProps) => {
    return (
        <div className="border p-3 space-y-2">
            <Label
                id={id}
                label={label}
            />
            <Amount
                id={id}
                amount={amount}
            />
            <DeleteActionButton id={id} />
        </div>
    );
};

const DeleteActionButton = ({
    id,
}: {
    id: typeof EnduranceActionsSchema.Type.id;
}) => {
    const { isEdit } = useEndurance();
    const deleteAction = useSetAtom(
        useMemo(() => editRescueActionsAtoms.deleteAction(id), [id]),
    );

    if (!isEdit) {
        return null;
    }

    return <button onClick={deleteAction}>削除</button>;
};

type LabelProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    label: string;
};

const Label = ({ id, label }: LabelProps) => {
    const { isEdit } = useEndurance();
    const [state, setState] = useAtom(
        useMemo(() => editRescueActionsAtoms.editLabel(id), [id]),
    );

    if (isEdit) {
        return (
            <>
                <input
                    defaultValue={state.value}
                    placeholder="初見、ギフト名など"
                    onChange={(e) => setState(e.target.value)}
                />
                {state.error && (
                    <p className="text-red-600 text-sm">{state.error}</p>
                )}
            </>
        );
    }

    return <div>{label}</div>;
};

type AmountProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    amount: number;
};

const Amount = ({ id, amount }: AmountProps) => {
    const { isEdit } = useEndurance();
    const [state, setState] = useAtom(
        useMemo(() => editRescueActionsAtoms.editAmount(id), [id]),
    );

    if (isEdit) {
        return (
            <>
                <input
                    defaultValue={state.value}
                    onChange={(e) => setState(Number(e.target.value))}
                />
                {state.error && (
                    <p className="text-red-600 text-sm">{state.error}</p>
                )}
            </>
        );
    }

    return <div>{amount}</div>;
};

EnduranceView.Count = Count;
EnduranceView.IncrementButton = IncrementButton;
EnduranceView.ActionsField = ActionsField;
EnduranceView.RescueActionsField = RescueActionsField;
EnduranceView.Action = Action;

export default EnduranceView;
