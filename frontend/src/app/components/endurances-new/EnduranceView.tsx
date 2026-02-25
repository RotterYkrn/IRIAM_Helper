import { useAtom, useAtomValue, useSetAtom, type WritableAtom } from "jotai";
import React, { createContext, useContext } from "react";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    editTargetCountAtomNew,
    editTargetCountErrorAtomNew,
} from "@/atoms/endurances-new/EditTargetCountAtom";
import type { EnduranceActionCountsSchema } from "@/domain/endurances-new/tables/EnduranceActionCounts";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import MinusButton from "@/utils/components/MinusButton";
import PlusButton from "@/utils/components/PlusButton";

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

type CountProgressProps = {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
};

const CountProgress = ({ left, center, right }: CountProgressProps) => {
    return (
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {left}
            {center}
            {right}
        </div>
    );
};

const EditTargetCount = () => {
    const [state, setState] = useAtom(editTargetCountAtomNew);
    const error = useAtomValue(editTargetCountErrorAtomNew);

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
                        defaultValue={state}
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
};

type ActionCountProps = {
    actionCount:
        | typeof EnduranceActionCountsSchema.Type.normal_count
        | typeof EnduranceActionsNewSchema.Type.count
        | typeof EnduranceActionsNewSchema.Encoded.count;
};

const ActionCount = ({ actionCount }: ActionCountProps) => {
    return (
        <p className="flex items-center justify-center font-mono text-2xl">
            {actionCount}
        </p>
    );
};

type CountButtonConfig = {
    label: string;
    count: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count;
    disabled?: boolean;
};

type PlusButtonsProps = {
    buttonConfigs: CountButtonConfig[];
    onIncrement: (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => void;
};

const PlusButtons = ({ buttonConfigs, onIncrement }: PlusButtonsProps) => {
    const { projectStatus } = useEndurance();

    if (projectStatus !== "active") {
        return null;
    }

    return (
        <>
            {buttonConfigs.map((config) => (
                <PlusButton
                    key={config.label}
                    onClick={() => onIncrement(config.count)}
                >
                    {config.label}
                </PlusButton>
            ))}
        </>
    );
};

type MinusButtonsProps = {
    buttonConfigs: CountButtonConfig[];
    onIncrement: (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => void;
};

const MinusButtons = ({ buttonConfigs, onIncrement }: MinusButtonsProps) => {
    const { projectStatus } = useEndurance();

    if (projectStatus !== "active") {
        return null;
    }

    return (
        <>
            {buttonConfigs.map((config) => (
                <MinusButton
                    key={config.label}
                    onClick={() => onIncrement(config.count)}
                    disabled={config.disabled ?? false}
                >
                    {config.label}
                </MinusButton>
            ))}
        </>
    );
};

type NormalActionProps = {
    children: React.ReactNode;
};

const NormalAction = ({ children }: NormalActionProps) => {
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
            <div className="flex flex-row justify-center gap-2">{children}</div>
        </div>
    );
};

const ActionsField = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-row gap-4">{children}</div>;
};

const ActionColumnClass = (actionLength: number) => {
    switch (actionLength) {
        case 1:
            return "grid-cols-1";
        case 2:
            return "grid-cols-2";
        case 3:
            return "grid-cols-3";
        default:
            return "grid-cols-4";
    }
};

type RescueActionsFieldProps = {
    children: React.ReactNode;
    actionLength: number;
    rescueCount: typeof EnduranceActionCountsSchema.Type.rescue_count;
    isWide: boolean;
};

const RescueActionsField = ({
    children,
    actionLength,
    rescueCount,
    isWide,
}: RescueActionsFieldProps) => {
    const { projectStatus, isEdit } = useEndurance();
    const createAction = useSetAtom(editRescueActionsAtomsNew.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (!isEdit && actionLength === 0) {
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
            <div
                className={`grid gap-4
                    ${isWide && !isEdit ? ActionColumnClass(actionLength) : "grid-cols-2"}`}
            >
                {children}
            </div>
        </div>
    );
};

type SabotageActionsFieldProps = {
    children: React.ReactNode;
    actionLength: number;
    sabotageCount: typeof EnduranceActionCountsSchema.Type.sabotage_count;
    isWide: boolean;
};

const SabotageActionsField = ({
    children,
    actionLength,
    sabotageCount,
    isWide,
}: SabotageActionsFieldProps) => {
    const { projectStatus, isEdit } = useEndurance();
    const createAction = useSetAtom(editSabotageActionsAtomsNew.createAction);

    const onAddAction = () => {
        createAction();
    };

    if (!isEdit && actionLength === 0) {
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
            <div
                className={`grid gap-4
                    ${isWide && !isEdit ? ActionColumnClass(actionLength) : "grid-cols-2"}`}
            >
                {children}
            </div>
        </div>
    );
};

type ActionProps = {
    children: React.ReactNode;
    className?: string;
};

const Action = ({ children, className }: ActionProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center p-2 gap-1
                bg-white rounded-xl border border-slate-300 shadow-sm
                ${className ?? "w-32"}`}
        >
            {children}
        </div>
    );
};

type SettingsLayoutProps = {
    children: React.ReactNode;
};

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {children}
        </div>
    );
};

type EditSettingsLayoutProps = {
    children: React.ReactNode;
};

const EditSettingsLayout = ({ children }: EditSettingsLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            {children}
        </div>
    );
};

type LabelProps = {
    label: string;
    className?: string;
};

const Label = ({ label, className }: LabelProps) => {
    return (
        <div className={`whitespace-nowrap ${className ?? "font-medium"}`}>
            {label}
        </div>
    );
};

type EditLabelProps = {
    editLabelAtom: WritableAtom<
        {
            value: typeof EnduranceActionsNewSchema.Type.label;
            error: string | null;
        },
        [newLabel: typeof EnduranceActionsNewSchema.Encoded.label],
        void
    >;
};

const EditLabel = ({ editLabelAtom }: EditLabelProps) => {
    const [state, setState] = useAtom(editLabelAtom);

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
};

type AmountProps = {
    actionType: typeof EnduranceActionsNewSchema.Type.type;
    amount: typeof EnduranceActionsNewSchema.Type.amount;
};

const Amount = ({ actionType, amount }: AmountProps) => {
    return (
        <div className="font-mono whitespace-nowrap text-lg">
            {actionType === "rescue" ? `(+${amount})` : `(-${amount})`}
        </div>
    );
};

type EditAmountProps = {
    editAmountAtom: WritableAtom<
        {
            value: typeof EnduranceActionsNewSchema.Type.amount;
            error: string | null;
        },
        [newLabel: typeof EnduranceActionsNewSchema.Encoded.amount],
        void
    >;
};

const EditAmount = ({ editAmountAtom }: EditAmountProps) => {
    const [state, setState] = useAtom(editAmountAtom);

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
};

type ProgressProps = {
    children: React.ReactNode;
};

const ActionProgress = ({ children }: ProgressProps) => {
    const { projectStatus, isEdit } = useEndurance();

    if (projectStatus === "scheduled" || isEdit) {
        return null;
    }

    return <div className="flex flex-row justify-center gap-2">{children}</div>;
};

type DeleteActionButtonProps = {
    deleteActionAtom: WritableAtom<null, [], void> & {
        init: null;
    };
};

const DeleteActionButton = ({ deleteActionAtom }: DeleteActionButtonProps) => {
    const onDelete = useSetAtom(deleteActionAtom);

    return (
        <button
            className="bg-gray-300 hover:bg-gray-200 px-2 py-1 rounded-md border
                border-gray-400 cursor-pointer"
            onClick={onDelete}
        >
            削除
        </button>
    );
};

EnduranceView.CountProgress = CountProgress;
EnduranceView.EditTargetCount = EditTargetCount;

EnduranceView.ActionCount = ActionCount;
EnduranceView.PlusButtons = PlusButtons;
EnduranceView.MinusButtons = MinusButtons;

EnduranceView.NormalAction = NormalAction;
EnduranceView.ActionsField = ActionsField;
EnduranceView.RescueActionsField = RescueActionsField;
EnduranceView.SabotageActionsField = SabotageActionsField;

EnduranceView.Action = Action;
EnduranceView.SettingsLayout = SettingsLayout;
EnduranceView.EditSettingsLayout = EditSettingsLayout;
EnduranceView.Label = Label;
EnduranceView.EditLabel = EditLabel;
EnduranceView.Amount = Amount;
EnduranceView.EditAmount = EditAmount;
EnduranceView.ActionProgress = ActionProgress;
EnduranceView.DeleteActionButton = DeleteActionButton;

export default EnduranceView;
