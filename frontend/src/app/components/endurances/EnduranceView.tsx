import { Chunk } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createContext, useContext, useMemo } from "react";

import { editRescueActionsAtoms } from "@/atoms/endurances/EditActionAtom";
import {
    editTargetCountAtom,
    editTargetCountErrorAtom,
} from "@/atoms/endurances/EditTargetCountAtom";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import type { EnduranceProgressSchema } from "@/domain/endurances/tables/EnduranceProgress";
import type { EnduranceActionStatSchema } from "@/domain/endurances/types/EnduranceActionStat";
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

type NormalActionProps = {
    normalCount: typeof EnduranceProgressSchema.Type.normal_count;
    onIncrementNormal: () => void;
};

const NormalAction = ({
    normalCount,
    onIncrementNormal,
}: NormalActionProps) => {
    const { projectStatus } = useEndurance();

    if (projectStatus === "scheduled") {
        return null;
    }

    const isActive = projectStatus === "active";

    return (
        <div
            className="flex flex-col items-center space-y-2 bg-white rounded-xl
                border border-slate-200 shadow-sm p-4 w-32"
        >
            {isActive && (
                <p
                    className="flex items-center justify-center font-mono
                        text-2xl"
                >
                    +1
                </p>
            )}
            <div className="flex flex-row justify-center gap-2">
                <p
                    className="flex items-center justify-center font-mono
                        text-2xl"
                >
                    {normalCount}
                </p>
                {isActive && (
                    <button
                        onClick={onIncrementNormal}
                        className={`w-7 h-7 flex items-center justify-center
                        rounded-full text-xl font-bold transition bg-blue-500
                        hover:bg-blue-600 active:scale-95 text-white`}
                    >
                        +
                    </button>
                )}
            </div>
        </div>
    );
};

const ActionsField = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

type RescueActionsFieldProps = {
    actions: typeof EnduranceRescueActionChunkSchema.Type;
    onIncrement: (
        id: typeof EnduranceActionsSchema.Type.id,
        actionType: typeof EnduranceActionsSchema.Type.type,
    ) => () => void;
};

const RescueActionsField = ({
    actions,
    onIncrement,
}: RescueActionsFieldProps) => {
    const { isEdit } = useEndurance();
    const state = useAtomValue(editRescueActionsAtoms.editActions);
    const createAction = useSetAtom(editRescueActionsAtoms.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (isEdit) {
        return (
            <div className="rounded-xl space-y-4 border p-4">
                <div className="flex justify-between items-center">
                    <h2>救済</h2>
                    <button onClick={onAddAction}>＋追加</button>
                </div>
                {Chunk.map(state, (action) => (
                    <Action
                        key={action.id}
                        id={action.id}
                        actionType={
                            "rescue" as typeof EnduranceActionsSchema.Type.type
                        }
                        label={action.label}
                        amount={action.amount}
                        actionCount={
                            0 as typeof EnduranceActionStatSchema.Type.action_times
                        }
                        onIncrement={onIncrement(
                            action.id,
                            "rescue" as typeof EnduranceActionsSchema.Type.type,
                        )}
                    />
                ))}
            </div>
        );
    }

    if (actions.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl space-y-4 border p-4">
            <div className="flex justify-between items-center">
                <h2>救済</h2>
            </div>
            {Chunk.map(actions, (action) => (
                <Action
                    key={action.id}
                    id={action.id}
                    actionType={action.type}
                    label={action.label}
                    amount={action.amount}
                    actionCount={action.action_times}
                    onIncrement={onIncrement(action.id, action.type)}
                />
            ))}
        </div>
    );
};

type ActionProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    actionType: typeof EnduranceActionsSchema.Type.type;
    label: typeof EnduranceActionsSchema.Type.label;
    amount: typeof EnduranceActionsSchema.Type.amount;
    actionCount: typeof EnduranceActionStatSchema.Type.action_times;
    onIncrement: () => void;
};

const Action = ({
    id,
    actionType,
    label,
    amount,
    actionCount,
    onIncrement,
}: ActionProps) => {
    return (
        <div
            className="flex flex-col p-3 space-y-2 bg-white rounded-xl border
                border-slate-200 shadow-sm w-32"
        >
            <Settings
                id={id}
                actionType={actionType}
                label={label}
                amount={amount}
            />
            <Progress
                actionCount={actionCount}
                onIncrement={onIncrement}
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

type SettingsProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    actionType: typeof EnduranceActionsSchema.Type.type;
    label: typeof EnduranceActionsSchema.Type.label;
    amount: typeof EnduranceActionsSchema.Type.amount;
};

const Settings = ({ id, actionType, label, amount }: SettingsProps) => {
    const { isEdit } = useEndurance();

    if (isEdit) {
        return (
            <div className="flex flex-col space-y-4">
                <Label
                    id={id}
                    label={label}
                />
                <Amount
                    id={id}
                    amount={amount}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-row space-x-2">
            <div className="font-medium">{label}</div>
            <div className="font-mono">
                {actionType === "rescue" ? `(+${amount})` : `(-${amount})`}
            </div>
        </div>
    );
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
    amount: typeof EnduranceActionsSchema.Type.amount;
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

type ProgressProps = {
    actionCount: typeof EnduranceActionStatSchema.Type.action_times;
    onIncrement: () => void;
};

const Progress = ({ actionCount, onIncrement }: ProgressProps) => {
    const { projectStatus, isEdit } = useEndurance();

    if (projectStatus === "scheduled" || isEdit) {
        return null;
    }

    const isActive = projectStatus === "active";

    return (
        <div className="flex flex-row justify-center gap-2">
            <p className="flex items-center justify-center font-mono text-2xl">
                {actionCount}
            </p>
            {isActive && (
                <button
                    onClick={onIncrement}
                    className={`w-7 h-7 flex items-center justify-center
                    rounded-full text-xl font-bold transition bg-blue-500
                    hover:bg-blue-600 active:scale-95 text-white`}
                >
                    +
                </button>
            )}
        </div>
    );
};

EnduranceView.Count = Count;
EnduranceView.IncrementButton = NormalAction;
EnduranceView.ActionsField = ActionsField;
EnduranceView.RescueActionsField = RescueActionsField;
EnduranceView.Action = Action;

export default EnduranceView;
