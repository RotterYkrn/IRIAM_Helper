import { Schema, Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

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
import { ProjectTitleSchema } from "@/domain/projects/tables/Project";
import { useCreateMultiEnduranceProject } from "@/hooks/multi-endurances/useCreateMultiEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateMultiEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const editUnits = useAtomValue(editUnitsAtom);
    const validEditState = useAtomValue(validEditMultiEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditMultiEnduranceAtom);
    const createUnit = useSetAtom(createUnitAtom);
    const disabled = !useAtomValue(isValidEditMultiEnduranceAtom);
    const createMutation = useCreateMultiEnduranceProject();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: Schema.decodeSync(ProjectTitleSchema)("○○ & ✕✕ 耐久"),
            units: Chunk.empty(),
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

        createMutation.mutate(validEditState, {
            onSuccess: (projectId) => {
                successToast(`「${validEditState.title}」を作成しました`);
                navigate(`/projects/endurance/${projectId}`);
            },
            onError: (error) => {
                console.error(error);
                errorToast(`「${validEditState.title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <div>
            <CreateProjectLayout
                isSaveDisabled={disabled}
                onSave={onSave}
            >
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
                            h-35 w-40 gap-8 rounded-md border-2 border-dashed
                            border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        <span className="text-xl font-bold text-gray-400">
                            ⊕追加
                        </span>
                    </button>
                </div>
            </CreateProjectLayout>
        </div>
    );
};

export default CreateMultiEnduranceProjectLayout;
