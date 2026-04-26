import { pipe, Chunk } from "effect";
import { useSetAtom } from "jotai";
import React, { createContext, useContext } from "react";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EnduranceActionCountsSchema } from "@/domain/endurances-new/tables/EnduranceActionCounts";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

/**
 * コンポーネント描画に必要な状態を共有する Context
 */
type EnduranceContextType = {
    projectStatus: typeof ProjectSchema.Type.status;
    isEdit: boolean;
    actionButtonCounts: Chunk.Chunk<
        typeof EnduranceActionHistoriesNewSchema.Encoded.action_count
    >;
};

const EnduranceContext = createContext<EnduranceContextType | null>(null);

/**
 * {@link EnduranceContext} の値を取得するためのカスタムフック
 *
 * @note {@link EnduranceView} 内で使用する必要があります。
 *
 * @throws EnduranceView 外から呼び出された場合にスローされます。
 *
 * @returns {} {@link EnduranceContextType}
 */
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

/**
 * 耐久企画のコンポーネント群
 *
 * @param contextValue 内部で使用するコンテキスト ({@link EnduranceContextType})
 */
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

type EditTargetCountContextType = {
    targetCountState: {
        input: string;
        error: string | null;
    };
    setTargetCount: (input: string) => void;
};

const EditTargetCount = ({
    targetCountState,
    setTargetCount,
}: EditTargetCountContextType) => {
    return (
        <>
            <label
                htmlFor="target-count"
                className="relative flex flex-col items-center"
            >
                {/* 左上に配置されるキャプション */}
                <span
                    className="absolute -top-6 -left-6 text-md font-medium
                        text-gray-600"
                >
                    目標数
                </span>

                <div className="flex w-full justify-center items-center">
                    <Input
                        id="target-count"
                        type="text"
                        className="text-4xl font-mono w-30"
                        value={targetCountState.input}
                        aria-invalid={!!targetCountState.error}
                        onChange={(e) => setTargetCount(e.target.value)}
                    />
                    {targetCountState.error && (
                        <p
                            className="absolute top-full mt-1 text-red-500
                                text-sm whitespace-nowrap"
                        >
                            {targetCountState.error}
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
        | typeof EnduranceActionsNewSchema.Type.count;
};

const ActionCount = ({ actionCount }: ActionCountProps) => {
    return (
        <p className="flex items-center justify-center font-mono text-2xl">
            {actionCount}
        </p>
    );
};

type PlusButtonsProps = {
    onIncrement: (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => void;
};

const PlusButtons = ({ onIncrement }: PlusButtonsProps) => {
    const { projectStatus, actionButtonCounts } = useEndurance();

    if (projectStatus !== "active") {
        return null;
    }

    const buttonConfigs = pipe(
        actionButtonCounts,
        Chunk.map((count) => ({
            label: count === 1 ? "+" : `+${count}`,
            count,
        })),
    );

    return (
        <div className="flex flex-row gap-2">
            {Chunk.map(buttonConfigs, (config) => (
                <Button
                    key={config.label}
                    className={`h-7 px-2 rounded-full text-white bg-blue-500
                    hover:bg-blue-500/80`}
                    onClick={() => onIncrement(config.count)}
                >
                    {config.label}
                </Button>
            ))}
        </div>
    );
};

type MinusButtonsProps = {
    disabled: boolean;
    onIncrement: (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => void;
};

const MinusButtons = ({ disabled, onIncrement }: MinusButtonsProps) => {
    const { projectStatus, actionButtonCounts } = useEndurance();

    if (projectStatus !== "active") {
        return null;
    }

    const buttonConfigs = pipe(
        actionButtonCounts,
        // Chunk.reverse,
        Chunk.map((count) => ({
            label: count === 1 ? "-" : `-${count}`,
            count: -count,
        })),
    );

    return (
        <div className="flex flex-row gap-2">
            {Chunk.map(buttonConfigs, (config) => (
                <Button
                    key={config.label}
                    className={`h-7 rounded-full text-white bg-red-500
                    hover:bg-red-500/80`}
                    disabled={disabled}
                    onClick={() => onIncrement(config.count)}
                >
                    {config.label}
                </Button>
            ))}
        </div>
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
                    <Button
                        variant={"outline"}
                        onClick={onAddAction}
                    >
                        ＋追加
                    </Button>
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
                    <Button
                        variant={"outline"}
                        onClick={onAddAction}
                    >
                        ＋追加
                    </Button>
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
            className={`relative flex flex-col items-center justify-center p-2
                gap-1 bg-white rounded-xl border border-slate-300 shadow-sm
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
    labelState: {
        input: string;
        error: string | null;
    };
    setLabel: (label: string) => void;
};

const EditLabel = ({ labelState, setLabel }: EditLabelProps) => {
    return (
        <>
            <Input
                className="w-20"
                value={labelState.input}
                placeholder="ラベルを入力"
                aria-invalid={!!labelState.error}
                onChange={(e) => setLabel(e.target.value)}
            />
            {labelState.error && (
                <p className="text-red-600 text-sm">{labelState.error}</p>
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
    amountState: {
        input: string;
        error: string | null;
    };
    setAmount: (amount: string) => void;
};

const EditAmount = ({ amountState, setAmount }: EditAmountProps) => {
    return (
        <>
            <Input
                className="w-20"
                value={amountState.input}
                placeholder="数値を入力"
                aria-invalid={!!amountState.error}
                onChange={(e) => setAmount(e.target.value)}
            />
            {amountState.error && (
                <p className="text-red-600 text-sm">{amountState.error}</p>
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

export default EnduranceView;
