import { Chunk, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

import EnduranceView from "./EnduranceView";

import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { isEnduranceValidAtom } from "@/atoms/endurances/isEditEnduranceValidAtom";
import {
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "@/domain/endurances/tables/EnduranceProgress";
import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceSettings";
import {
    ProjectStatusSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";
import { useCreateEnduranceProject } from "@/hooks/endurances/useCreateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isEnduranceValidAtom);

    const createMutation = useCreateEnduranceProject();

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
            <EnduranceView
                projectStatus={Schema.decodeSync(ProjectStatusSchema)(
                    "scheduled",
                )}
                isEdit={true}
            >
                <EnduranceView.Count
                    currentCount={0}
                    targetCount={100}
                />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actions={Chunk.empty()}
                        rescueCount={Schema.decodeSync(
                            EnduranceRescueCountSchema,
                        )(0)}
                        isWide={false}
                        onIncrement={() => () => {}}
                    />
                    <EnduranceView.SabotageActionsField
                        actions={Chunk.empty()}
                        sabotageCount={Schema.decodeSync(
                            EnduranceSabotageCountSchema,
                        )(0)}
                        isWide={false}
                        onIncrement={() => () => {}}
                    />
                </EnduranceView.ActionsField>
            </EnduranceView>
        </CreateProjectLayout>
    );
};

export default CreateEnduranceProjectLayout;
