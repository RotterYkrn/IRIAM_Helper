import console from "console";

import { useQueryClient } from "@tanstack/react-query";
import { Chunk, pipe, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectLayout from "../projects/ProjectLayout";

import EditEnduranceActionRow from "./EditEnduranceActionRow";
import EnduranceActionRow from "./EnduranceActionRow";
import EnduranceView from "./EnduranceView";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import type {
    EnduranceRescueActionDtoSchema,
    EnduranceSabotageActionDtoSchema,
} from "@/domain/endurances-new/dto/EnduranceProjectDto";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import { EnduranceActionTypeSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { ProjectTypeSchema } from "@/domain/projects/tables/Project";
import { useDuplicateEnduranceProjectNew } from "@/hooks/endurances-new/useDuplicateEnduranceProject";
import { useFetchEnduranceProjectNew } from "@/hooks/endurances-new/useFetchEnduranceProject";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";
import { useUpdateEnduranceProjectNew } from "@/hooks/endurances-new/useUpdateEnduranceProject";
import { EnduranceKey } from "@/hooks/query-keys/endurances";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: string;
};

/**
 * 耐久企画ページのレイアウト
 */
const EnduranceProjectLayout = ({ projectId }: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    const projectQuery = useFetchEnduranceProjectNew(projectId);
    const updateEnduranceProject = useUpdateEnduranceProjectNew();
    const duplicateEnduranceProject = useDuplicateEnduranceProjectNew();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const validEditState = useAtomValue(validEditEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isValidEditEnduranceAtom);

    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    if (projectQuery.isLoading) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!projectQuery.data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const project = projectQuery.data;

    const onEdit = () => {
        initEditEndurance({
            title: project.title,
            target_count: project.unit.target_count,
            rescue_actions: pipe(
                project.rescue_actions,
                Chunk.map((id) =>
                    queryClient.getQueryData<
                        typeof EnduranceRescueActionDtoSchema.Type
                    >(EnduranceKey.action(id)),
                ),
                Chunk.filter(
                    (
                        action,
                    ): action is typeof EnduranceRescueActionDtoSchema.Type =>
                        action !== undefined,
                ),
            ),
            sabotage_actions: pipe(
                project.sabotage_actions,
                Chunk.map((id) =>
                    queryClient.getQueryData<
                        typeof EnduranceSabotageActionDtoSchema.Type
                    >(EnduranceKey.action(id)),
                ),
                Chunk.filter(
                    (
                        action,
                    ): action is typeof EnduranceSabotageActionDtoSchema.Type =>
                        action !== undefined,
                ),
            ),
        });
        setIsEdit(true);
    };

    const onSave = () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        updateEnduranceProject.mutate(
            {
                id: project.id,
                unit_id: project.unit.id,
                ...validEditState,
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

    const onDuplicate = () => {
        if (!confirm("この企画をコピーしますか？")) {
            return;
        }
        duplicateEnduranceProject.mutate(
            { project_id: project.id },
            {
                onSuccess: (id) => {
                    successToast(`「${project.title}」がコピーされました`);
                    navigate(`/projects/endurance/${id}`);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(`「${project.title}」のコピーに失敗しました`);
                },
            },
        );
    };

    const actionButtonCounts = Chunk.fromIterable([1]);

    const onIncrementNormal = (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => {
        logEnduranceActionHistory.mutate({
            p_project_id: project.id,
            p_unit_id: project.unit.id,
            p_action_history_type: "normal",
            p_action_count: actionCount,
        });
    };

    // 片方の要素がない場合は、各アクションの幅を広く使わせる
    const isWideRescue = project.sabotage_actions.length === 0;
    const isWideSabotage = project.rescue_actions.length === 0;

    return (
        <ProjectLayout
            project={{
                ...project,
                type: Schema.decodeSync(ProjectTypeSchema)("endurance"),
            }}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isSaveDisabled={disabled}
            onEdit={onEdit}
            onSave={onSave}
            onDuplicate={onDuplicate}
        >
            <EnduranceView
                projectStatus={project.status}
                isEdit={isEdit}
                actionButtonCounts={actionButtonCounts}
            >
                {isEdit ? (
                    <EnduranceView.EditTargetCount />
                ) : (
                    <EnduranceView.CountProgress
                        left={
                            <div className="text-right text-4xl font-mono">
                                {project.unit.current_count}
                            </div>
                        }
                        center={
                            <div className="text-5xl font-mono text-gray-400">
                                /
                            </div>
                        }
                        right={
                            <div className="text-left text-4xl font-mono">
                                {project.unit.target_count}
                            </div>
                        }
                    />
                )}
                <EnduranceView.NormalAction>
                    <EnduranceView.MinusButtons
                        disabled={project.action_count.normal_count <= 0}
                        onIncrement={onIncrementNormal}
                    />
                    <EnduranceView.ActionCount
                        actionCount={project.action_count.normal_count}
                    />
                    <EnduranceView.PlusButtons
                        onIncrement={onIncrementNormal}
                    />
                </EnduranceView.NormalAction>
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={project.rescue_actions.length}
                        rescueCount={project.action_count.rescue_count}
                        isWide={isWideRescue}
                    >
                        {isEdit
                            ? Chunk.map(editRescueState, (action) => (
                                  <EditEnduranceActionRow
                                      key={action.id}
                                      actionId={action.id}
                                      actionType={Schema.decodeSync(
                                          EnduranceActionTypeSchema,
                                      )("rescue")}
                                  />
                              ))
                            : Chunk.map(project.rescue_actions, (actionId) => (
                                  <EnduranceActionRow
                                      key={actionId}
                                      projectId={project.id}
                                      unitId={project.unit.id}
                                      actionId={actionId}
                                  />
                              ))}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={project.sabotage_actions.length}
                        sabotageCount={project.action_count.sabotage_count}
                        isWide={isWideSabotage}
                    >
                        {isEdit
                            ? Chunk.map(editSabotageState, (action) => (
                                  <EditEnduranceActionRow
                                      key={action.id}
                                      actionId={action.id}
                                      actionType={Schema.decodeSync(
                                          EnduranceActionTypeSchema,
                                      )("sabotage")}
                                  />
                              ))
                            : Chunk.map(
                                  project.sabotage_actions,
                                  (actionId) => (
                                      <EnduranceActionRow
                                          key={actionId}
                                          projectId={project.id}
                                          unitId={project.unit.id}
                                          actionId={actionId}
                                      />
                                  ),
                              )}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
