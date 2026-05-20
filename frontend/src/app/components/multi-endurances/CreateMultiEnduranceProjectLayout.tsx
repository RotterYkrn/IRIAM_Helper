import { Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectContainer from "../projects/containers/CreateProjectContainer";

import AddUnitButton from "./AddUnitButton";
import EditEnduranceUnitRow from "./EditEnduranceUnitRow";

import {
    initEditMultiEnduranceAtom,
    isValidEditMultiEnduranceAtom,
    validEditMultiEnduranceAtom,
} from "@/atoms/multi-endurances/EditMultiEnduranceAtom";
import {
    createUnitAtom,
    editUnitsAtom,
} from "@/atoms/multi-endurances/EditUnitsAtom";
import {
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitLabelSchema,
} from "@/domain/endurances/tables/EnduranceUnits";
import { ProjectTitleSchema } from "@/domain/projects/tables/Project";
import { useCreateMultiEnduranceProject } from "@/hooks/multi-endurances/useCreateMultiEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateMultiEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const editUnits = useAtomValue(editUnitsAtom);
    const validEditState = useAtomValue(validEditMultiEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditMultiEnduranceAtom);
    const createUnit = useSetAtom(createUnitAtom);
    const isValidState = useAtomValue(isValidEditMultiEnduranceAtom);

    const { create, isCreating } = useCreateMultiEnduranceProject();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: ProjectTitleSchema.make("○○ & ✕✕ 耐久"),
            units: Chunk.fromIterable([
                {
                    id: EnduranceUnitIdSchema.make(crypto.randomUUID()),
                    position: 0,
                    label: EnduranceUnitLabelSchema.make("入室"),
                    target_count: EnduranceTargetCountSchema.make(10),
                    current_count: 0,
                },
                {
                    id: EnduranceUnitIdSchema.make(crypto.randomUUID()),
                    position: 1,
                    label: EnduranceUnitLabelSchema.make("バッジ"),
                    target_count: EnduranceTargetCountSchema.make(10),
                    current_count: 0,
                },
            ]),
        }),
    );

    useLayoutEffect(() => {
        initEvent();
    }, []);

    const onSave = async () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        create(validEditState, {
            onSuccess: ({ id, title }) => {
                successToast(`「${title}」を作成しました`);
                navigate(`/projects/multi-endurance/${id}`);
            },
            onError: (error) => {
                console.error(error);
                errorToast(`「${validEditState.title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <CreateProjectContainer
            canSave={isValidState}
            isSaving={isCreating}
            onSave={onSave}
        >
            <span className="text-md font-medium text-gray-600">
                ※目標数を空欄もしくは0にすると、目標数なし設定にできます
            </span>
            <div className="grid grid-cols-3 gap-4">
                {Chunk.map(editUnits, (unit) => (
                    <EditEnduranceUnitRow
                        key={unit.id}
                        unitId={unit.id}
                    />
                ))}
                <AddUnitButton onClick={createUnit} />
            </div>
        </CreateProjectContainer>
    );
};

export default CreateMultiEnduranceProjectLayout;
