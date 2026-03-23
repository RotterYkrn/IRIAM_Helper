import { Chunk } from "effect";
import { useAtomValue } from "jotai";
import { useState } from "react";

import EnduranceView from "../endurances-new/EnduranceView";
import ProjectLayout from "../projects/ProjectLayout";

import EnduranceUnitRow from "./EnduranceUnitRow";

import { isValidEditEnduranceAtom } from "@/atoms/endurances-new/EditEnduranceAtom";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { useFetchMultiEnduranceProject } from "@/hooks/multi-endurances/useFetchMultiEnduranceProject";

type Props = {
    projectId: ProjectId;
};

/**
 * 耐久企画ページのレイアウト
 */
const MultiEnduranceProjectLayout = ({ projectId }: Props) => {
    // const queryClient = useQueryClient();
    // const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    const projectQuery = useFetchMultiEnduranceProject(projectId);
    // const updateEnduranceProject = useUpdateEnduranceProjectNew();
    // const duplicateEnduranceProject = useDuplicateEnduranceProjectNew();
    // const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    // const validEditState = useAtomValue(validEditEnduranceAtom);
    // const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isValidEditEnduranceAtom);

    // const [editTargetCountState, setEditTargetCount] =
    //     useAtom(editTargetCountAtom);
    // const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    // const editSabotageState = useAtomValue(
    //     editSabotageActionsAtomsNew.editActions,
    // );

    if (projectQuery.isLoading) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!projectQuery.data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const project = projectQuery.data;

    // const onEdit = () => {
    //     initEditEndurance({
    //         title: project.title,
    //         target_count: project.unit.target_count,
    //         rescue_actions: pipe(
    //             project.rescue_actions,
    //             Chunk.map((id) =>
    //                 queryClient.getQueryData<
    //                     typeof EnduranceRescueActionDtoSchema.Type
    //                 >(EnduranceKey.action(id)),
    //             ),
    //             Chunk.filter(
    //                 (
    //                     action,
    //                 ): action is typeof EnduranceRescueActionDtoSchema.Type =>
    //                     action !== undefined,
    //             ),
    //         ),
    //         sabotage_actions: pipe(
    //             project.sabotage_actions,
    //             Chunk.map((id) =>
    //                 queryClient.getQueryData<
    //                     typeof EnduranceSabotageActionDtoSchema.Type
    //                 >(EnduranceKey.action(id)),
    //             ),
    //             Chunk.filter(
    //                 (
    //                     action,
    //                 ): action is typeof EnduranceSabotageActionDtoSchema.Type =>
    //                     action !== undefined,
    //             ),
    //         ),
    //     });
    //     setIsEdit(true);
    // };

    // const onSave = () => {
    //     if (!validEditState) {
    //         errorToast(`無効なフィールドがあります`);
    //         return;
    //     }

    //     updateEnduranceProject.mutate(
    //         {
    //             id: project.id,
    //             unit_id: project.unit.id,
    //             ...validEditState,
    //         },
    //         {
    //             onSuccess: () => {
    //                 successToast("更新しました");
    //                 setIsEdit(false);
    //             },
    //             onError: (error) => {
    //                 console.error(error);
    //                 errorToast("更新に失敗しました");
    //             },
    //         },
    //     );
    // };

    // const onDuplicate = () => {
    //     if (!confirm("この企画をコピーしますか？")) {
    //         return;
    //     }
    //     duplicateEnduranceProject.mutate(
    //         { project_id: project.id },
    //         {
    //             onSuccess: (id) => {
    //                 successToast(`「${project.title}」がコピーされました`);
    //                 navigate(`/projects/endurance/${id}`);
    //             },
    //             onError: (error) => {
    //                 console.error(error);
    //                 errorToast(`「${project.title}」のコピーに失敗しました`);
    //             },
    //         },
    //     );
    // };

    const actionButtonCounts = Chunk.fromIterable([1]);

    // const onIncrementNormal = (
    //     actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    // ) => {
    //     logEnduranceActionHistory.mutate({
    //         p_project_id: project.id,
    //         p_unit_id: project.unit.id,
    //         p_action_history_type: "normal",
    //         p_action_count: actionCount,
    //     });
    // };

    // // 片方の要素がない場合は、各アクションの幅を広く使わせる
    // const isWideRescue = project.sabotage_actions.length === 0;
    // const isWideSabotage = project.rescue_actions.length === 0;

    return (
        <ProjectLayout
            project={project}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isSaveDisabled={disabled}
            onEdit={() => {}}
            onSave={() => {}}
            onDuplicate={() => {}}
        >
            <EnduranceView
                projectStatus={project.status}
                isEdit={isEdit}
                actionButtonCounts={actionButtonCounts}
            >
                <div className="grid grid-cols-3 gap-4">
                    {Chunk.map(project.units, (id) => (
                        <EnduranceUnitRow
                            key={id}
                            unitId={id}
                        />
                    ))}
                </div>
            </EnduranceView>
        </ProjectLayout>
    );
};

export default MultiEnduranceProjectLayout;
