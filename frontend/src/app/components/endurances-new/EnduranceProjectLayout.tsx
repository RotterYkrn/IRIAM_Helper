import { Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import ProjectLayout from "../projects/ProjectLayout";

import EnduranceViewNew from "./EnduranceView";

import {
    editEnduranceAtomNew,
    initEditEnduranceAtomNew,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import { isEnduranceValidAtomNew } from "@/atoms/endurances-new/isEditEnduranceValidAtom";
import {
    EnduranceActionTypeSchema,
    type EnduranceActionsSchema,
} from "@/domain/endurances/tables/EnduranceActions";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import { ProjectTypeSchema } from "@/domain/projects/tables/Project";
import { useFetchEnduranceProjectNew } from "@/hooks/endurances-new/useFetchEnduranceProject";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";
import { useUpdateEnduranceProjectNew } from "@/hooks/endurances-new/useUpdateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: string;
};

const EnduranceProjectLayoutNew = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const [projectQuery, actionStatsQuery] =
        useFetchEnduranceProjectNew(projectId);
    const updateEnduranceProject = useUpdateEnduranceProjectNew();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const editState = useAtomValue(editEnduranceAtomNew);
    const initEditEndurance = useSetAtom(initEditEnduranceAtomNew);
    const disabled = !useAtomValue(isEnduranceValidAtomNew);

    if (!projectQuery.data || !actionStatsQuery.data) {
        return null;
    }

    const project = projectQuery.data;
    const actionStats = actionStatsQuery.data;

    const onEdit = () => {
        initEditEndurance({
            title: project.title,
            target_count: project.target_count,
            rescue_actions: actionStats.rescue_actions,
            sabotage_actions: actionStats.sabotage_actions,
        });
        setIsEdit(true);
    };

    const onSave = () => {
        updateEnduranceProject.mutate(
            {
                id: project.id,
                unit_id: project.unit_id,
                ...editState,
            },
            {
                onSuccess: () => {
                    successToast("更新しました");
                    setIsEdit(false);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast("更新に失敗しました");
                },
            },
        );
    };

    const onIncrementNormal = (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => {
        logEnduranceActionHistory.mutate({
            p_project_id: project.id,
            p_unit_id: project.unit_id,
            p_action_history_type: "normal",
            p_action_count: actionCount,
        });
    };

    const isWideRescue = actionStats.sabotage_actions.length === 0;
    const isWideSabotage = actionStats.rescue_actions.length === 0;

    const onIncrement =
        (actionType: typeof EnduranceActionsSchema.Type.type) =>
        (actionId: typeof EnduranceActionsSchema.Type.id) =>
        (
            actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
        ) => {
            logEnduranceActionHistory.mutate({
                p_project_id: project.id,
                p_unit_id: project.unit_id,
                p_action_history_type: actionType,
                p_action_id: actionId,
                p_action_count: actionCount,
            });
        };

    return (
        <ProjectLayout
            project={{
                ...project,
                type: Schema.decodeSync(ProjectTypeSchema)("endurance"),
            }}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            onEdit={onEdit}
            disabled={disabled}
            onSave={onSave}
        >
            <EnduranceViewNew
                projectStatus={project.status}
                isEdit={isEdit}
            >
                <EnduranceViewNew.Count
                    currentCount={project.current_count}
                    targetCount={project.target_count}
                />
                <EnduranceViewNew.NormalAction
                    normalCount={project.normal_count}
                    onIncrementNormal={onIncrementNormal}
                />
                <EnduranceViewNew.ActionsField>
                    <EnduranceViewNew.RescueActionsField
                        actions={actionStats.rescue_actions}
                        rescueCount={project.rescue_count}
                        isWide={isWideRescue}
                        onIncrement={onIncrement(
                            Schema.decodeSync(EnduranceActionTypeSchema)(
                                "rescue",
                            ),
                        )}
                    />
                    <EnduranceViewNew.SabotageActionsField
                        actions={actionStats.sabotage_actions}
                        sabotageCount={project.sabotage_count}
                        isWide={isWideSabotage}
                        onIncrement={onIncrement(
                            Schema.decodeSync(EnduranceActionTypeSchema)(
                                "sabotage",
                            ),
                        )}
                    />
                </EnduranceViewNew.ActionsField>
            </EnduranceViewNew>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayoutNew;
