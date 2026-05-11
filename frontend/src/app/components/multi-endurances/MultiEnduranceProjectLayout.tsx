import { useQueryClient } from "@tanstack/react-query";
import { Chunk, pipe } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import ProjectContainer from "../projects/containers/ProjectContainer";
import EnduranceView from "../ui/EnduranceView";

import AddUnitButton from "./AddUnitButton";
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
import { useDuplicateMultiEnduranceProjectNew } from "@/hooks/multi-endurances/useDuplicateMultiEnduranceProject";
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
    const navigate = useNavigate();
    const { isEdit, setIsEdit } = useProjectContext();

    const { data, isFetching } = useFetchMultiEnduranceProject(projectId);
    const { update, isUpdating } = useUpdateMultiEnduranceProject();
    const { duplicate, isDuplicating } = useDuplicateMultiEnduranceProjectNew();

    const editUnits = useAtomValue(editUnitsAtom);
    const validEditState = useAtomValue(validEditMultiEnduranceAtom);
    const initEditMultiEndurance = useSetAtom(initEditMultiEnduranceAtom);
    const createUnit = useSetAtom(createUnitAtom);
    const isValidState = useAtomValue(isValidEditMultiEnduranceAtom);

    if (isFetching) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!data) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const onEdit = () => {
        initEditMultiEndurance({
            title: data.title,
            units: pipe(
                data.units,
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

        update(
            {
                id: data.id,
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
                onSuccess: (id) => {
                    successToast(`「${data.title}」がコピーされました`);
                    navigate(`/projects/multi-endurance/${id}`);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(`「${data.title}」のコピーに失敗しました`);
                },
            },
        );
    };

    const actionButtonCounts = Chunk.fromIterable([1, 10, 100]);

    return (
        <ProjectContainer
            isPendingAction={isDuplicating}
            canSave={isValidState}
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
                <div className="grid grid-cols-3 gap-4">
                    {isEdit ? (
                        <>
                            {Chunk.map(editUnits, (unit) => (
                                <EditEnduranceUnitRow
                                    key={unit.id}
                                    unitId={unit.id}
                                />
                            ))}
                            <AddUnitButton onClick={createUnit} />
                        </>
                    ) : (
                        <>
                            {Chunk.map(data.units, (id) => (
                                <EnduranceUnitRow
                                    key={id}
                                    projectId={data.id}
                                    unitId={id}
                                />
                            ))}
                        </>
                    )}
                </div>
            </EnduranceView>
        </ProjectContainer>
    );
};

export default MultiEnduranceProjectLayout;
