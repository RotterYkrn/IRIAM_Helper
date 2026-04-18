import { useQueryClient } from "@tanstack/react-query";
import { Chunk, pipe } from "effect";
import { useAtomValue, useSetAtom } from "jotai";

import EnduranceView from "../endurances-new/EnduranceView";
import ProjectContainer from "../projects/containers/ProjectContainer";

import EditEnduranceUnitRow from "./EditEnduranceUnitRow";
import EnduranceUnitRow from "./EnduranceUnitRow";

import {
    initEditMultiEnduranceAtom,
    isValidEditMultiEnduranceAtom,
    validEditMultiEnduranceAtom,
} from "@/atoms/multi-endurances/EditMultiEnduranceAtom";
import {
    createUnitAtom,
    editUnitsAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import { useProjectContext } from "@/contexts/projects/useProjectContext";
import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { useFetchMultiEnduranceProject } from "@/hooks/multi-endurances/useFetchMultiEnduranceProject";
import { useUpdateMultiEnduranceProject } from "@/hooks/multi-endurances/useUpdateMultiEnduranceProject";
import { EnduranceKey } from "@/hooks/query-keys/endurances";
import { errorToast, successToast } from "@/utils/toast";

type Props = {
    projectId: ProjectId;
};

/**
 * 耐久企画ページのレイアウト
 */
const MultiEnduranceProjectLayout = ({ projectId }: Props) => {
    const queryClient = useQueryClient();
    // const navigate = useNavigate();
    const { isEdit, setIsEdit } = useProjectContext();

    const projectQuery = useFetchMultiEnduranceProject(projectId);
    const updateProject = useUpdateMultiEnduranceProject();
    // const duplicateEnduranceProject = useDuplicateEnduranceProjectNew();

    const editUnits = useAtomValue(editUnitsAtom);
    const validEditState = useAtomValue(validEditMultiEnduranceAtom);
    const initEditMultiEndurance = useSetAtom(initEditMultiEnduranceAtom);
    const createUnit = useSetAtom(createUnitAtom);
    const disabled = !useAtomValue(isValidEditMultiEnduranceAtom);

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
        initEditMultiEndurance({
            title: project.title,
            units: pipe(
                project.units,
                Chunk.map((id) =>
                    queryClient.getQueryData<
                        typeof MultiEnduranceUnitSchema.Type
                    >(EnduranceKey.unit(id)),
                ),
                Chunk.filter(
                    (unit): unit is typeof MultiEnduranceUnitSchema.Type =>
                        unit !== undefined,
                ),
            ),
        });
    };

    const onSave = () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        updateProject.mutate(
            {
                id: project.id,
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

    return (
        <ProjectContainer
            isSaveDisabled={disabled}
            onEdit={onEdit}
            onSave={onSave}
            onDuplicate={() => {}}
        >
            <EnduranceView
                projectStatus={project.status}
                isEdit={isEdit}
                actionButtonCounts={actionButtonCounts}
            >
                {isEdit ? (
                    <div className="grid grid-cols-3 gap-4">
                        {Chunk.map(editUnits, (unit) => (
                            <EditEnduranceUnitRow
                                key={unit.id}
                                unitId={unit.id}
                            />
                        ))}
                        <button
                            onClick={createUnit}
                            className="flex flex-col items-center justify-center
                                h-35 w-40 gap-8 rounded-md border-2
                                border-dashed border-gray-300 hover:bg-gray-200
                                transition-colors"
                        >
                            <span className="text-xl font-bold text-gray-400">
                                ⊕追加
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {Chunk.map(project.units, (id) => (
                            <EnduranceUnitRow
                                key={id}
                                projectId={project.id}
                                unitId={id}
                            />
                        ))}
                    </div>
                )}
            </EnduranceView>
        </ProjectContainer>
    );
};

export default MultiEnduranceProjectLayout;
