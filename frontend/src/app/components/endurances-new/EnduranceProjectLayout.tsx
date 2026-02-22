import { Chunk, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import ProjectLayout from "../projects/ProjectLayout";

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
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { ProjectTypeSchema } from "@/domain/projects/tables/Project";
import { useFetchEnduranceProjectNew } from "@/hooks/endurances-new/useFetchEnduranceProject";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";
import { useUpdateEnduranceProjectNew } from "@/hooks/endurances-new/useUpdateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const [projectQuery, actionStatsQuery] =
        useFetchEnduranceProjectNew(projectId);
    const updateEnduranceProject = useUpdateEnduranceProjectNew();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const editState = useAtomValue(editEnduranceAtomNew);
    const initEditEndurance = useSetAtom(initEditEnduranceAtomNew);
    const disabled = !useAtomValue(isEnduranceValidAtomNew);

    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    if (!projectQuery.data || !actionStatsQuery.data) {
        return <>企画の取得に失敗しました</>;
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
        (
            actionType: typeof EnduranceActionsNewSchema.Type.type,
            actionId: typeof EnduranceActionsNewSchema.Type.id,
        ) =>
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
                                  (action) => (
                                      <EnduranceView.Action key={action.id}>
                                          <EnduranceView.SettingsLayout>
                                              <EnduranceView.Label
                                                  label={action.label}
                                              />
                                              <EnduranceView.Amount
                                                  actionType={action.type}
                                                  amount={action.amount}
                                              />
                                          </EnduranceView.SettingsLayout>
                                          <EnduranceView.ActionProgress>
                                              <EnduranceView.MinusButtons
                                                  buttonConfigs={[
                                                      {
                                                          label: "-",
                                                          count: -1,
                                                      },
                                                  ]}
                                                  onIncrement={onIncrement(
                                                      action.type,
                                                      action.id,
                                                  )}
                                              />
                                              <EnduranceView.ActionCount
                                                  actionCount={action.count}
                                              />
                                              <EnduranceView.PlusButtons
                                                  buttonConfigs={[
                                                      {
                                                          label: "+",
                                                          count: 1,
                                                      },
                                                  ]}
                                                  onIncrement={onIncrement(
                                                      action.type,
                                                      action.id,
                                                  )}
                                              />
                                          </EnduranceView.ActionProgress>
                                      </EnduranceView.Action>
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
                                  (action) => (
                                      <EnduranceView.Action key={action.id}>
                                          <EnduranceView.SettingsLayout>
                                              <EnduranceView.Label
                                                  label={action.label}
                                              />
                                              <EnduranceView.Amount
                                                  actionType={action.type}
                                                  amount={action.amount}
                                              />
                                          </EnduranceView.SettingsLayout>
                                          <EnduranceView.ActionProgress>
                                              <EnduranceView.MinusButtons
                                                  buttonConfigs={[
                                                      {
                                                          label: "-",
                                                          count: -1,
                                                      },
                                                  ]}
                                                  onIncrement={onIncrement(
                                                      action.type,
                                                      action.id,
                                                  )}
                                              />
                                              <EnduranceView.ActionCount
                                                  actionCount={action.count}
                                              />
                                              <EnduranceView.PlusButtons
                                                  buttonConfigs={[
                                                      {
                                                          label: "+",
                                                          count: 1,
                                                      },
                                                  ]}
                                                  onIncrement={onIncrement(
                                                      action.type,
                                                      action.id,
                                                  )}
                                              />
                                          </EnduranceView.ActionProgress>
                                      </EnduranceView.Action>
                                  ),
                              )}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
