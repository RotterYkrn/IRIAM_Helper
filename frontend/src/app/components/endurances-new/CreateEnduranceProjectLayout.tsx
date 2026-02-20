import { Chunk, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

import EnduranceViewNew from "./EnduranceView";

import {
    editEnduranceAtomNew,
    initEditEnduranceAtomNew,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import { isEnduranceValidAtomNew } from "@/atoms/endurances-new/isEditEnduranceValidAtom";
import {
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "@/domain/endurances/tables/EnduranceProgress";
import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceSettings";
import {
    ProjectStatusSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";
import { useCreateEnduranceProjectNew } from "@/hooks/endurances-new/useCreateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateEnduranceProjectLayoutNew = () => {
    const navigate = useNavigate();

    const editState = useAtomValue(editEnduranceAtomNew);
    const initEditEndurance = useSetAtom(initEditEnduranceAtomNew);
    const disabled = !useAtomValue(isEnduranceValidAtomNew);

    const createMutation = useCreateEnduranceProjectNew();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: Schema.decodeSync(ProjectTitleSchema)("○○耐久"),
            target_count: Schema.decodeSync(EnduranceTargetCountSchema)(100),
            rescue_actions: Chunk.empty(),
            sabotage_actions: Chunk.empty(),
        }),
    );

    useEffect(() => {
        initEvent();
    }, []);

    const onSave = async () => {
        createMutation.mutate(editState, {
            onSuccess: (projectId) => {
                successToast(`「${editState.title}」を作成しました`);
                navigate(`/projects/endurance/${projectId}`);
            },
            onError: (error) => {
                console.error(error);
                errorToast(`「${editState.title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <CreateProjectLayout
            disabled={disabled}
            onSave={onSave}
        >
            <EnduranceViewNew
                projectStatus={Schema.decodeSync(ProjectStatusSchema)(
                    "scheduled",
                )}
                isEdit={true}
            >
                <EnduranceViewNew.Count
                    currentCount={0}
                    targetCount={100}
                />
                <EnduranceViewNew.ActionsField>
                    <EnduranceViewNew.RescueActionsField
                        actions={Chunk.empty()}
                        rescueCount={Schema.decodeSync(
                            EnduranceRescueCountSchema,
                        )(0)}
                        isWide={false}
                        onIncrement={() => () => {}}
                    />
                    <EnduranceViewNew.SabotageActionsField
                        actions={Chunk.empty()}
                        sabotageCount={Schema.decodeSync(
                            EnduranceSabotageCountSchema,
                        )(0)}
                        isWide={false}
                        onIncrement={() => () => {}}
                    />
                </EnduranceViewNew.ActionsField>
            </EnduranceViewNew>
        </CreateProjectLayout>
    );
};

export default CreateEnduranceProjectLayoutNew;
