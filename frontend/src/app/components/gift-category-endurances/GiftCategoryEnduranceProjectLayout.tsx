import { Chunk, Order, pipe } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import ProjectContainer from "../projects/containers/ProjectContainer";
import EnduranceView from "../ui/EnduranceView";
import EnduranceUnitRow from "./EnduranceUnitRow";

import { editTargetCountAtom } from "@/atoms/endurances/EditTargetCountAtom";
import {
    initEditGiftCategoryEnduranceAtom,
    isValidEditGiftCategoryEnduranceAtom,
    validEditGiftCategoryEnduranceAtom,
} from "@/atoms/gift-category-endurances/EditGiftCategoryEnduranceAtom";
import { useProjectContext } from "@/contexts/projects/useProjectContext";
import type { GiftDto } from "@/domain/gifts/dto/GiftDto";
import type { ProjectId } from "@/domain/projects/tables/Project";
import { useDuplicateGiftCategoryEnduranceProject } from "@/hooks/gift-category-endurances/useDuplicateGiftCategoryEnduranceProject";
import { useFetchGiftCategoryEnduranceProject } from "@/hooks/gift-category-endurances/useFetchEnduranceProject";
import { useUpdateGiftCategoryEnduranceProject } from "@/hooks/gift-category-endurances/useUpdateEnduranceProject";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";
import { errorToast, successToast } from "@/utils/toast";
import InputField from "../ui/InputField";

type Props = {
    projectId: ProjectId;
};

/**
 * 耐久企画ページのレイアウト
 */
const GiftCategoryEnduranceProjectLayout = ({ projectId }: Props) => {
    const navigate = useNavigate();
    const { gifts } = useGiftQuery();
    const { isEdit, setIsEdit } = useProjectContext();

    const { data, isFetching } =
        useFetchGiftCategoryEnduranceProject(projectId);
    const { update, isUpdating } = useUpdateGiftCategoryEnduranceProject();
    const { duplicate, isDuplicating } =
        useDuplicateGiftCategoryEnduranceProject();

    const [targetCountState, setTargetCount] = useAtom(editTargetCountAtom);
    const validEditState = useAtomValue(validEditGiftCategoryEnduranceAtom);
    const initEditGiftCategoryEndurance = useSetAtom(
        initEditGiftCategoryEnduranceAtom,
    );
    const isValidState = useAtomValue(isValidEditGiftCategoryEnduranceAtom);

    if (isFetching) {
        return <div className="flex justify-center">読み込み中...</div>;
    }

    if (!data || data.units.length === 0) {
        return (
            <div className="flex justify-center">企画の取得に失敗しました</div>
        );
    }

    const targetGifts = pipe(
        gifts,
        Chunk.filter((gift) => gift.point >= 200),
        Chunk.sort(Order.mapInput(Order.number, (gift: GiftDto) => gift.point)),
    );

    const onEdit = () => {
        initEditGiftCategoryEndurance({
            title: data.title,
            target_count: data.target_count,
        });
    };

    const onSave = () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        const updateArgs = {
            ...validEditState,
            project_id: data.id,
            units: Chunk.map(targetGifts, (g, i) => ({
                position: i,
                gift_id: g.id,
            })),
        };

        update(updateArgs, {
            onSuccess: () => {
                successToast("更新しました");
                setIsEdit(false);
            },
            onError: (error) => {
                console.error(error);
                errorToast("更新に失敗しました");
            },
        });
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
                    navigate(`/projects/gift-category-endurance/${id}`);
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(`「${data.title}」のコピーに失敗しました`);
                },
            },
        );
    };

    const actionButtonCounts = Chunk.fromIterable([1]);

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
                {isEdit ? (
                    <>
                        <div className="flex flex-row gap-2 pl-8">
                            <InputField
                                label="周回数"
                                error={targetCountState.error}
                                setValue={setTargetCount}
                                value={targetCountState.input}
                                className="text-4xl font-mono w-30"
                            />
                            <div className="flex items-end text-2xl">周</div>
                        </div>
                        <span className="text-md font-medium text-gray-600">
                            ※目標数を空欄もしくは0にすると、∞周に設定にできます
                        </span>
                    </>
                ) : (
                    <div className="flex flex-row gap-6 pl-8">
                        <EnduranceView.CountProgress
                            target_count={data.target_count}
                            current_count={data.allCurrentCount}
                        />
                        <div className="flex items-end text-3xl">周</div>
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                    {Chunk.map(data.units, (id) => (
                        <EnduranceUnitRow
                            key={id}
                            projectId={data.id}
                            unitId={id}
                        />
                    ))}
                </div>
            </EnduranceView>
        </ProjectContainer>
    );
};

export default GiftCategoryEnduranceProjectLayout;
