import console from "console";

import { useQueryClient } from "@tanstack/react-query";
import { Chunk, pipe } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import ProjectContainer from "../projects/containers/ProjectContainer";
import EnduranceView from "../ui/EnduranceView";

import EditEnduranceActionRow from "./EditEnduranceActionRow";
import EnduranceActionRow from "./EnduranceActionRow";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import { editTargetCountAtom } from "@/atoms/endurances-new/EditTargetCountAtom";
import { useProjectContext } from "@/contexts/projects/useProjectContext";
import type {
    EnduranceRescueActionDtoSchema,
    EnduranceSabotageActionDtoSchema,
} from "@/domain/endurances-new/dto/EnduranceProjectDto";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import { useDuplicateEnduranceProjectNew } from "@/hooks/endurances-new/useDuplicateEnduranceProject";
import { useFetchEnduranceProjectNew } from "@/hooks/endurances-new/useFetchEnduranceProject";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";
import { useUpdateEnduranceProjectNew } from "@/hooks/endurances-new/useUpdateEnduranceProject";
import { EnduranceKey } from "@/hooks/query-keys/endurances";
import { errorToast, successToast } from "@/utils/toast";

/**
 * 耐久企画ページのレイアウト
 */
const EnduranceProjectLayout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { project, isEdit, setIsEdit } = useProjectContext();

    const enduranceDataQuery = useFetchEnduranceProjectNew(project.id);
    const updateEnduranceProject = useUpdateEnduranceProjectNew();
    const duplicateEnduranceProject = useDuplicateEnduranceProjectNew();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const validEditState = useAtomValue(validEditEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isValidEditEnduranceAtom);

    const [editTargetCountState, setEditTargetCount] =
        useAtom(editTargetCountAtom);
    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    if (enduranceDataQuery.isLoading) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!enduranceDataQuery.data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const enduranceData = enduranceDataQuery.data;

    const onEdit = () => {
        initEditEndurance({
            title: enduranceData.title,
            target_count: enduranceData.unit.target_count,
            rescue_actions: pipe(
                enduranceData.rescue_actions,
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
                enduranceData.sabotage_actions,
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
    };

    const onSave = () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        updateEnduranceProject.mutate(
            {
                id: enduranceData.id,
                unit_id: enduranceData.unit.id,
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
            { project_id: enduranceData.id },
            {
                onSuccess: (id) => {
                    successToast(
                        `「${enduranceData.title}」がコピーされました`,
                    );
                    navigate(`/projects/endurance/${id}`);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(
                        `「${enduranceData.title}」のコピーに失敗しました`,
                    );
                },
            },
        );
    };

    const actionButtonCounts = Chunk.fromIterable([1]);

    const onIncrementNormal = (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) => {
        logEnduranceActionHistory.mutate({
            p_project_id: enduranceData.id,
            p_unit_id: enduranceData.unit.id,
            p_action_history_type: "normal",
            p_action_count: actionCount,
        });
    };

    // 片方の要素がない場合は、各アクションの幅を広く使わせる
    const isWideRescue = enduranceData.sabotage_actions.length === 0;
    const isWideSabotage = enduranceData.rescue_actions.length === 0;

    return (
        <ProjectContainer
            isSaveDisabled={disabled}
            onEdit={onEdit}
            onSave={onSave}
            onDuplicate={onDuplicate}
        >
            <EnduranceView
                projectStatus={enduranceData.status}
                isEdit={isEdit}
                actionButtonCounts={actionButtonCounts}
            >
                {isEdit ? (
                    <EnduranceView.EditTargetCount
                        targetCountState={editTargetCountState}
                        setTargetCount={setEditTargetCount}
                    />
                ) : (
                    <EnduranceView.CountProgress
                        left={
                            <div className="text-right text-4xl font-mono">
                                {enduranceData.unit.current_count}
                            </div>
                        }
                        center={
                            <div className="text-5xl font-mono text-gray-400">
                                /
                            </div>
                        }
                        right={
                            <div className="text-left text-4xl font-mono">
                                {enduranceData.unit.target_count}
                            </div>
                        }
                    />
                )}
                <EnduranceView.NormalAction>
                    <EnduranceView.MinusButtons
                        disabled={enduranceData.action_count.normal_count <= 0}
                        onIncrement={onIncrementNormal}
                    />
                    <EnduranceView.ActionCount
                        actionCount={enduranceData.action_count.normal_count}
                    />
                    <EnduranceView.PlusButtons
                        onIncrement={onIncrementNormal}
                    />
                </EnduranceView.NormalAction>
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={enduranceData.rescue_actions.length}
                        rescueCount={enduranceData.action_count.rescue_count}
                        isWide={isWideRescue}
                    >
                        {isEdit
                            ? Chunk.map(editRescueState, (action) => (
                                  <EditEnduranceActionRow
                                      key={action.id}
                                      actionId={action.id}
                                      actionType={"rescue"}
                                  />
                              ))
                            : Chunk.map(
                                  enduranceData.rescue_actions,
                                  (actionId) => (
                                      <EnduranceActionRow
                                          key={actionId}
                                          projectId={enduranceData.id}
                                          unitId={enduranceData.unit.id}
                                          actionId={actionId}
                                      />
                                  ),
                              )}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={enduranceData.sabotage_actions.length}
                        sabotageCount={
                            enduranceData.action_count.sabotage_count
                        }
                        isWide={isWideSabotage}
                    >
                        {isEdit
                            ? Chunk.map(editSabotageState, (action) => (
                                  <EditEnduranceActionRow
                                      key={action.id}
                                      actionId={action.id}
                                      actionType={"sabotage"}
                                  />
                              ))
                            : Chunk.map(
                                  enduranceData.sabotage_actions,
                                  (actionId) => (
                                      <EnduranceActionRow
                                          key={actionId}
                                          projectId={enduranceData.id}
                                          unitId={enduranceData.unit.id}
                                          actionId={actionId}
                                      />
                                  ),
                              )}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectContainer>
    );
};

export default EnduranceProjectLayout;
