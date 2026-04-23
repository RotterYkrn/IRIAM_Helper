import { Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectContainer from "../projects/containers/CreateProjectContainer";

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
import { Button } from "@/components/ui/button";
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
            title: ProjectTitleSchema.make("○○ & ✕✕ 耐久"),
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
                navigate(`/projects/multi-endurance/${projectId}`);
            },
            onError: (error) => {
                console.error(error);
                errorToast(`「${validEditState.title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <div>
            <CreateProjectContainer
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
                    <Button
                        variant="outline"
                        className="h-35 w-40 border-2 border-dashed"
                        onClick={createUnit}
                    >
                        <span className="text-xl font-bold text-gray-400">
                            ⊕追加
                        </span>
                    </Button>
                </div>
            </CreateProjectContainer>
        </div>
    );
};

export default CreateMultiEnduranceProjectLayout;
