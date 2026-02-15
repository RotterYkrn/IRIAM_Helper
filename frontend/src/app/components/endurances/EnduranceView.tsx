import { Chunk, Schema } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createContext, useContext, useMemo } from "react";

import {
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "@/atoms/endurances/EditActionAtom";
import {
    editTargetCountAtom,
    editTargetCountErrorAtom,
} from "@/atoms/endurances/EditTargetCountAtom";
import {
    EnduranceActionTypeSchema,
    type EnduranceActionsSchema,
} from "@/domain/endurances/tables/EnduranceActions";
import { type EnduranceProgressSchema } from "@/domain/endurances/tables/EnduranceProgress";
import {
    EnduranceActionTimesSchema,
    type EnduranceActionStatSchema,
} from "@/domain/endurances/types/EnduranceActionStat";
import type { EnduranceActionStatsViewSchema } from "@/domain/endurances/views/EnduranceActionStatsView";
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
    return <div className="flex flex-row gap-4">{children}</div>;
};

type RescueActionsFieldProps = {
    actions: typeof EnduranceActionStatsViewSchema.Type.rescue_actions;
    rescueCount: typeof EnduranceProgressSchema.Type.rescue_count;
    onIncrement: (id: typeof EnduranceActionsSchema.Type.id) => void;
};

const RescueActionsField = ({
    actions,
    rescueCount,
    onIncrement,
}: RescueActionsFieldProps) => {
    const { projectStatus, isEdit } = useEndurance();
    const state = useAtomValue(editRescueActionsAtoms.editActions);
    const createAction = useSetAtom(editRescueActionsAtoms.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (!isEdit && actions.length === 0) {
        return null;
    }

    return (
        <div
            className="flex flex-col rounded-xl space-y-4 border border-red-500
                p-4 bg-red-400 shadow-md"
        >
            <div className="flex justify-between items-center gap-4">
                <h2 className="text-lg font-bold">救済</h2>
                {isEdit && (
                    <button
                        className="bg-red-200 hover:bg-red-300 px-2 py-1
                            rounded-md border border-red-300"
                        onClick={onAddAction}
                    >
                        ＋追加
                    </button>
                )}
                {projectStatus !== "scheduled" && (
                    <p
                        className="flex items-center justify-center font-mono
                            text-2xl"
                    >
                        +{rescueCount}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {isEdit
                    ? Chunk.map(state, (action) => (
                          <Action
                              key={action.id}
                              id={action.id}
                              actionType={Schema.decodeSync(
                                  EnduranceActionTypeSchema,
                              )("rescue")}
                              label={action.label}
                              amount={action.amount}
                              actionCount={Schema.decodeSync(
                                  EnduranceActionTimesSchema,
                              )(0)}
                              onIncrement={() => {}}
                          />
                      ))
                    : Chunk.map(actions, (action) => (
                          <Action
                              key={action.id}
                              id={action.id}
                              actionType={action.type}
                              label={action.label}
                              amount={action.amount}
                              actionCount={action.action_times}
                              onIncrement={() => onIncrement(action.id)}
                          />
                      ))}
            </div>
        </div>
    );
};

type SabotageActionsFieldProps = {
    actions: typeof EnduranceActionStatsViewSchema.Type.sabotage_actions;
    sabotageCount: typeof EnduranceProgressSchema.Type.sabotage_count;
    onIncrement: (id: typeof EnduranceActionsSchema.Type.id) => void;
};

const SabotageActionsField = ({
    actions,
    sabotageCount,
    onIncrement,
}: SabotageActionsFieldProps) => {
    const { projectStatus, isEdit } = useEndurance();
    const state = useAtomValue(editSabotageActionsAtoms.editActions);
    const createAction = useSetAtom(editSabotageActionsAtoms.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (!isEdit && actions.length === 0) {
        return null;
    }

    return (
        <div
            className="flex flex-col rounded-xl space-y-4 border border-blue-500
                p-4 bg-blue-400 shadow-md"
        >
            <div className="flex justify-between items-center gap-4">
                <h2 className="text-lg font-bold">妨害</h2>
                {isEdit && (
                    <button
                        className="bg-blue-200 hover:bg-blue-300 px-2 py-1
                            rounded-md border border-blue-400"
                        onClick={onAddAction}
                    >
                        ＋追加
                    </button>
                )}
                {projectStatus !== "scheduled" && (
                    <p
                        className="flex items-center justify-center font-mono
                            text-2xl"
                    >
                        -{sabotageCount}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {isEdit
                    ? Chunk.map(state, (action) => (
                          <Action
                              key={action.id}
                              id={action.id}
                              actionType={Schema.decodeSync(
                                  EnduranceActionTypeSchema,
                              )("sabotage")}
                              label={action.label}
                              amount={action.amount}
                              actionCount={Schema.decodeSync(
                                  EnduranceActionTimesSchema,
                              )(0)}
                              onIncrement={() => {}}
                          />
                      ))
                    : Chunk.map(actions, (action) => (
                          <Action
                              key={action.id}
                              id={action.id}
                              actionType={action.type}
                              label={action.label}
                              amount={action.amount}
                              actionCount={action.action_times}
                              onIncrement={() => onIncrement(action.id)}
                          />
                      ))}
            </div>
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
            className="flex flex-col items-center justify-center p-2 gap-1
                bg-white rounded-xl border border-slate-300 shadow-sm w-32"
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
            <DeleteActionButton
                id={id}
                actionType={actionType}
            />
        </div>
    );
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
            <div className="flex flex-col items-center justify-center space-y-2">
                <Label
                    id={id}
                    actionType={actionType}
                    label={label}
                />
                <Amount
                    id={id}
                    actionType={actionType}
                    amount={amount}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Label
                id={id}
                actionType={actionType}
                label={label}
            />
            <Amount
                id={id}
                actionType={actionType}
                amount={amount}
            />
        </div>
    );
};

type LabelProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    actionType: typeof EnduranceActionsSchema.Type.type;
    label: string;
};

const Label = ({ id, actionType, label }: LabelProps) => {
    const { isEdit } = useEndurance();
    const [state, setState] = useAtom(
        useMemo(
            () =>
                actionType === "rescue"
                    ? editRescueActionsAtoms.editLabel(id)
                    : editSabotageActionsAtoms.editLabel(id),
            [id, actionType],
        ),
    );

    if (isEdit) {
        return (
            <>
                <input
                    className="w-20 text-center outline-none border-b-2
                        border-gray-300 focus:border-gray-500 transition-colors"
                    defaultValue={state.value}
                    placeholder="ラベルを入力"
                    onChange={(e) => setState(e.target.value)}
                />
                {state.error && (
                    <p className="text-red-600 text-sm">{state.error}</p>
                )}
            </>
        );
    }

    return <div className="whitespace-nowrap font-medium">{label}</div>;
};

type AmountProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    actionType: typeof EnduranceActionsSchema.Type.type;
    amount: typeof EnduranceActionsSchema.Type.amount;
};

const Amount = ({ id, actionType, amount }: AmountProps) => {
    const { isEdit } = useEndurance();
    const [state, setState] = useAtom(
        useMemo(
            () =>
                actionType === "rescue"
                    ? editRescueActionsAtoms.editAmount(id)
                    : editSabotageActionsAtoms.editAmount(id),
            [id, actionType],
        ),
    );

    if (isEdit) {
        return (
            <>
                <input
                    className="w-20 text-center outline-none border-b-2
                        border-gray-300 focus:border-gray-500 transition-colors"
                    defaultValue={state.value}
                    placeholder="数値を入力"
                    onChange={(e) => setState(Number(e.target.value))}
                />
                {state.error && (
                    <p className="text-red-600 text-sm">{state.error}</p>
                )}
            </>
        );
    }

    return (
        <div className="font-mono whitespace-nowrap text-lg">
            {actionType === "rescue" ? `(+${amount})` : `(-${amount})`}
        </div>
    );
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

type DeleteActionButtonProps = {
    id: typeof EnduranceActionsSchema.Type.id;
    actionType: typeof EnduranceActionsSchema.Type.type;
};

const DeleteActionButton = ({ id, actionType }: DeleteActionButtonProps) => {
    const { isEdit } = useEndurance();
    const deleteAction = useSetAtom(
        useMemo(
            () =>
                actionType === "rescue"
                    ? editRescueActionsAtoms.deleteAction(id)
                    : editSabotageActionsAtoms.deleteAction(id),
            [id, actionType],
        ),
    );

    if (!isEdit) {
        return null;
    }

    return (
        <button
            className="bg-gray-300 hover:bg-gray-200 px-2 py-1 rounded-md border
                border-gray-400"
            onClick={deleteAction}
        >
            削除
        </button>
    );
};

EnduranceView.Count = Count;
EnduranceView.NormalAction = NormalAction;
EnduranceView.ActionsField = ActionsField;
EnduranceView.RescueActionsField = RescueActionsField;
EnduranceView.SabotageActionsField = SabotageActionsField;

export default EnduranceView;
