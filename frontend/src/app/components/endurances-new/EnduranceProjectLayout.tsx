import { useQueryClient } from "@tanstack/react-query";
import { Chunk, pipe, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectLayout from "../projects/ProjectLayout";

import EnduranceActionRow from "./EnduranceActionRow";
import EnduranceView from "./EnduranceView";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    editEnduranceAtomNew,
    initEditEnduranceAtomNew,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import { isEnduranceValidAtomNew } from "@/atoms/endurances-new/isEditEnduranceValidAtom";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import type {
    EnduranceRescueActionSchema,
    EnduranceSabotageActionSchema,
} from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import { ProjectTypeSchema } from "@/domain/projects/tables/Project";
import { useDuplicateEnduranceProjectNew } from "@/hooks/endurances-new/useDuplicateEnduranceProject";
import { useFetchEnduranceProjectNew } from "@/hooks/endurances-new/useFetchEnduranceProject";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";
import { useUpdateEnduranceProjectNew } from "@/hooks/endurances-new/useUpdateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    const [projectQuery, actionStatsQuery] =
        useFetchEnduranceProjectNew(projectId);
    const updateEnduranceProject = useUpdateEnduranceProjectNew();
    const duplicateEnduranceProject = useDuplicateEnduranceProjectNew();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const editState = useAtomValue(editEnduranceAtomNew);
    const initEditEndurance = useSetAtom(initEditEnduranceAtomNew);
    const disabled = !useAtomValue(isEnduranceValidAtomNew);

    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    if (projectQuery.isLoading || actionStatsQuery.isLoading) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!projectQuery.data || !actionStatsQuery.data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const project = projectQuery.data;
    const actionStats = actionStatsQuery.data;

    const onEdit = () => {
        initEditEndurance({
            title: project.title,
            target_count: project.target_count,
            rescue_actions: pipe(
                actionStats.rescue_actions,
                Chunk.map((id) =>
                    queryClient.getQueryData<
                        typeof EnduranceRescueActionSchema.Type
                    >(["action", id]),
                ),
                Chunk.filter(
                    (
                        action,
                    ): action is typeof EnduranceRescueActionSchema.Type =>
                        action !== undefined,
                ),
            ),
            sabotage_actions: pipe(
                actionStats.sabotage_actions,
                Chunk.map((id) =>
                    queryClient.getQueryData<
                        typeof EnduranceSabotageActionSchema.Type
                    >(["action", id]),
                ),
                Chunk.filter(
                    (
                        action,
                    ): action is typeof EnduranceSabotageActionSchema.Type =>
                        action !== undefined,
                ),
            ),
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
            >
                {isEdit ? (
                    <EnduranceView.EditTargetCount />
                ) : (
                    <EnduranceView.CountProgress
                        left={
                            <div className="text-right text-4xl font-mono">
                                {project.current_count}
                            </div>
                        }
                        center={
                            <div className="text-5xl font-mono text-gray-400">
                                /
                            </div>
                        }
                        right={
                            <div className="text-left text-4xl font-mono">
                                {project.target_count}
                            </div>
                        }
                    />
                )}
                <EnduranceView.NormalAction>
                    <EnduranceView.MinusButtons
                        buttonConfigs={[
                            {
                                label: "-",
                                count: -1,
                                disabled: project.normal_count <= 0,
                            },
                        ]}
                        onIncrement={onIncrementNormal}
                    />
                    <EnduranceView.ActionCount
                        actionCount={project.normal_count}
                    />
                    <EnduranceView.PlusButtons
                        buttonConfigs={[
                            {
                                label: "+",
                                count: 1,
                            },
                        ]}
                        onIncrement={onIncrementNormal}
                    />
                </EnduranceView.NormalAction>
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={actionStats.rescue_actions.length}
                        rescueCount={project.rescue_count}
                        isWide={isWideRescue}
                    >
                        {isEdit
                            ? Chunk.map(editRescueState, (action) => (
                                  <EnduranceView.Action key={action.id}>
                                      <EnduranceView.EditSettingsLayout>
                                          <EnduranceView.EditLabel
                                              editLabelAtom={editRescueActionsAtomsNew.editLabel(
                                                  action.id,
                                              )}
                                          />
                                          <EnduranceView.EditAmount
                                              editAmountAtom={editRescueActionsAtomsNew.editAmount(
                                                  action.id,
                                              )}
                                          />
                                      </EnduranceView.EditSettingsLayout>
                                      <EnduranceView.DeleteActionButton
                                          deleteActionAtom={editRescueActionsAtomsNew.deleteAction(
                                              action.id,
                                          )}
                                      />
                                  </EnduranceView.Action>
                              ))
                            : Chunk.map(
                                  actionStats.rescue_actions,
                                  (actionId) => (
                                      <EnduranceActionRow
                                          key={actionId}
                                          projectId={project.id}
                                          unitId={project.unit_id}
                                          actionId={actionId}
                                      />
                                  ),
                              )}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={actionStats.sabotage_actions.length}
                        sabotageCount={project.sabotage_count}
                        isWide={isWideSabotage}
                    >
                        {isEdit
                            ? Chunk.map(editSabotageState, (action) => (
                                  <EnduranceView.Action key={action.id}>
                                      <EnduranceView.EditSettingsLayout>
                                          <EnduranceView.EditLabel
                                              editLabelAtom={editSabotageActionsAtomsNew.editLabel(
                                                  action.id,
                                              )}
                                          />
                                          <EnduranceView.EditAmount
                                              editAmountAtom={editSabotageActionsAtomsNew.editAmount(
                                                  action.id,
                                              )}
                                          />
                                      </EnduranceView.EditSettingsLayout>
                                      <EnduranceView.DeleteActionButton
                                          deleteActionAtom={editSabotageActionsAtomsNew.deleteAction(
                                              action.id,
                                          )}
                                      />
                                  </EnduranceView.Action>
                              ))
                            : Chunk.map(
                                  actionStats.sabotage_actions,
                                  (actionId) => (
                                      <EnduranceActionRow
                                          key={actionId}
                                          projectId={project.id}
                                          unitId={project.unit_id}
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
