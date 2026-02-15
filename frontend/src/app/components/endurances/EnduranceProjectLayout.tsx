import { Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import ProjectLayout from "../projects/ProjectLayout";

import EnduranceView from "./EnduranceView";

import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { isEnduranceValidAtom } from "@/atoms/endurances/isEditEnduranceValidAtom";
import type { EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import {
    EnduranceActionTypeSchema,
    type EnduranceActionsSchema,
} from "@/domain/endurances/tables/EnduranceActions";
import { ProjectTypeSchema } from "@/domain/projects/tables/Project";
import { useFetchEnduranceProject } from "@/hooks/endurances/useFetchEnduranceProject";
import { useLogEnduranceActionHistory } from "@/hooks/endurances/useLogEnduranceActionHistory";
import { useUpdateEnduranceProject } from "@/hooks/endurances/useUpdateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const [projectQuery, actionStatsQuery] =
        useFetchEnduranceProject(projectId);
    const updateEnduranceProject = useUpdateEnduranceProject();
    const logEnduranceActionHistory = useLogEnduranceActionHistory();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isEnduranceValidAtom);

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
        isReversal: typeof EnduranceActionHistoriesSchema.Encoded.is_reversal,
    ) => {
        logEnduranceActionHistory.mutate({
            p_project_id: project.id,
            p_action_history_type: "normal",
            p_is_reversal: isReversal,
        });
    };

    const isWideRescue = actionStats.sabotage_actions.length === 0;
    const isWideSabotage = actionStats.rescue_actions.length === 0;

    const onIncrement =
        (actionType: typeof EnduranceActionsSchema.Type.type) =>
        (actionId: typeof EnduranceActionsSchema.Type.id) =>
        (
            isReversal: typeof EnduranceActionHistoriesSchema.Encoded.is_reversal,
        ) => {
            logEnduranceActionHistory.mutate({
                p_project_id: project.id,
                p_action_history_type: actionType,
                p_action_id: actionId,
                p_is_reversal: isReversal,
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
            <EnduranceView
                projectStatus={project.status}
                isEdit={isEdit}
            >
                <EnduranceView.Count
                    currentCount={project.current_count}
                    targetCount={project.target_count}
                />
                <EnduranceView.NormalAction
                    normalCount={project.normal_count}
                    onIncrementNormal={onIncrementNormal}
                />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actions={actionStats.rescue_actions}
                        rescueCount={project.rescue_count}
                        isWide={isWideRescue}
                        onIncrement={onIncrement(
                            Schema.decodeSync(EnduranceActionTypeSchema)(
                                "rescue",
                            ),
                        )}
                    />
                    <EnduranceView.SabotageActionsField
                        actions={actionStats.sabotage_actions}
                        sabotageCount={project.sabotage_count}
                        isWide={isWideSabotage}
                        onIncrement={onIncrement(
                            Schema.decodeSync(EnduranceActionTypeSchema)(
                                "sabotage",
                            ),
                        )}
                    />
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
