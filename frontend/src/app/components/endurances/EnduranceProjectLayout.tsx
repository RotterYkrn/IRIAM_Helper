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
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "@/atoms/endurances/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { editTargetCountAtom } from "@/atoms/endurances/EditTargetCountAtom";
import { useProjectContext } from "@/contexts/projects/useProjectContext";
import type {
    EnduranceRescueActionDtoSchema,
    EnduranceSabotageActionDtoSchema,
} from "@/domain/endurances/dto/EnduranceProjectDto";
import type { EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import { useDuplicateEnduranceProject } from "@/hooks/endurances/useDuplicateEnduranceProject";
import { useFetchEnduranceProject } from "@/hooks/endurances/useFetchEnduranceProject";
import { useLogEnduranceActionHistory } from "@/hooks/endurances/useLogEnduranceActionHistory";
import { useUpdateEnduranceProject } from "@/hooks/endurances/useUpdateEnduranceProject";
import { EnduranceKey } from "@/hooks/query-keys/endurances";
import { errorToast, successToast } from "@/utils/toast";

/**
 * 耐久企画ページのレイアウト
 */
const EnduranceProjectLayout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { project, isEdit, setIsEdit } = useProjectContext();

    const { data, isFetching } = useFetchEnduranceProject(project.id);
    const { update, isUpdating } = useUpdateEnduranceProject();
    const { duplicate, isDuplicating } = useDuplicateEnduranceProject();
    const logEnduranceActionHistory = useLogEnduranceActionHistory();

    const validEditState = useAtomValue(validEditEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const isValidEditState = useAtomValue(isValidEditEnduranceAtom);

    const [editTargetCountState, setEditTargetCount] =
        useAtom(editTargetCountAtom);
    const editRescueState = useAtomValue(editRescueActionsAtoms.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtoms.editActions,
    );

    if (isFetching) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const onEdit = () => {
        initEditEndurance({
            title: data.title,
            target_count: data.unit.target_count,
            rescue_actions: pipe(
                data.rescue_actions,
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
                data.sabotage_actions,
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

        update(
            {
                id: data.id,
                unit_id: data.unit.id,
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
        duplicate(
            { project_id: data.id },
            {
                onSuccess: ({ id }) => {
                    successToast(`「${data.title}」がコピーされました`);
                    navigate(`/projects/endurance/${id}`);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(`「${data.title}」のコピーに失敗しました`);
                },
            },
        );
    };

    const actionButtonCounts = Chunk.fromIterable([1]);

    const onIncrementNormal = (
        actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count,
    ) => {
        logEnduranceActionHistory.mutate({
            p_project_id: data.id,
            p_unit_id: data.unit.id,
            p_action_history_type: "normal",
            p_action_count: actionCount,
        });
    };

    // 片方の要素がない場合は、各アクションの幅を広く使わせる
    const isWideRescue = data.sabotage_actions.length === 0;
    const isWideSabotage = data.rescue_actions.length === 0;

    return (
        <ProjectContainer
            isPendingAction={isDuplicating}
            canSave={isValidEditState}
            isSaving={isUpdating}
            onEdit={onEdit}
            onSave={onSave}
            onDuplicate={onDuplicate}
        >
            <EnduranceView
                projectStatus={data.status}
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
                                {data.unit.current_count}
                            </div>
                        }
                        center={
                            <div className="text-5xl font-mono text-gray-400">
                                /
                            </div>
                        }
                        right={
                            <div className="text-left text-4xl font-mono">
                                {data.unit.target_count}
                            </div>
                        }
                    />
                )}
                <EnduranceView.NormalAction>
                    <EnduranceView.MinusButtons
                        disabled={data.action_count.normal_count <= 0}
                        onIncrement={onIncrementNormal}
                    />
                    <EnduranceView.ActionCount
                        actionCount={data.action_count.normal_count}
                    />
                    <EnduranceView.PlusButtons
                        onIncrement={onIncrementNormal}
                    />
                </EnduranceView.NormalAction>
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={data.rescue_actions.length}
                        rescueCount={data.action_count.rescue_count}
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
                            : Chunk.map(data.rescue_actions, (actionId) => (
                                  <EnduranceActionRow
                                      key={actionId}
                                      projectId={data.id}
                                      unitId={data.unit.id}
                                      actionId={actionId}
                                  />
                              ))}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={data.sabotage_actions.length}
                        sabotageCount={data.action_count.sabotage_count}
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
                            : Chunk.map(data.sabotage_actions, (actionId) => (
                                  <EnduranceActionRow
                                      key={actionId}
                                      projectId={data.id}
                                      unitId={data.unit.id}
                                      actionId={actionId}
                                  />
                              ))}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </ProjectContainer>
    );
};

export default EnduranceProjectLayout;
