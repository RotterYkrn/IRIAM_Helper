import { Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import ProjectLayout from "../projects/ProjectLayout";

import EnduranceView from "./EnduranceView";

import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { isEnduranceValidAtom } from "@/atoms/endurances/isEditEnduranceValidAtom";
import { useFetchEnduranceData as useFetchEnduranceProject } from "@/hooks/endurances/useFetchEnduranceProject";
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
            sabotage_actions: Chunk.empty(),
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

    const onIncrement = () => {
        logEnduranceActionHistory.mutate({
            p_project_id: project.id,
            p_action_history_type: "normal",
        });
    };

    return (
        <ProjectLayout
            project={project}
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
                <EnduranceView.IncrementButton onIncrement={onIncrement} />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actions={actionStats.rescue_actions}
                    />
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
