import { Chunk } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

import EnduranceView from "./EnduranceView";

import {
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "@/atoms/endurances/EditActionAtom";
import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { isEnduranceValidAtom } from "@/atoms/endurances/isEditEnduranceValidAtom";
import type { EnduranceSettingsSchema } from "@/domain/endurances/tables/EnduranceSettings";
import type { EnduranceActionStatSchema } from "@/domain/endurances/types/EnduranceActionStat";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { useCreateEnduranceProject } from "@/hooks/endurances/useCreateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isEnduranceValidAtom);

    const editRescueActions = useAtomValue(editRescueActionsAtoms.editActions);
    const editSabotageActions = useAtomValue(
        editSabotageActionsAtoms.editActions,
    );

    const createMutation = useCreateEnduranceProject();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: "○○耐久" as typeof ProjectSchema.Type.title,
            target_count:
                100 as typeof EnduranceSettingsSchema.Type.target_count,
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

    const rescueActionsWithType = useMemo(
        () =>
            Chunk.map(editRescueActions, (action) => ({
                ...action,
                type: "rescue" as Extract<
                    typeof EnduranceActionStatSchema.Type.type,
                    "rescue"
                >,
                action_times:
                    0 as typeof EnduranceActionStatSchema.Type.action_times,
            })),
        [editRescueActions],
    );

    const sabotageActionsWithType = useMemo(
        () =>
            Chunk.map(editSabotageActions, (action) => ({
                ...action,
                type: "sabotage" as Extract<
                    typeof EnduranceActionStatSchema.Type.type,
                    "sabotage"
                >,
                action_times:
                    0 as typeof EnduranceActionStatSchema.Type.action_times,
            })),
        [editSabotageActions],
    );

    return (
        <CreateProjectLayout
            disabled={disabled}
            onSave={onSave}
        >
            <EnduranceView
                projectStatus={"scheduled" as typeof ProjectSchema.Type.status}
                isEdit={true}
            >
                <EnduranceView.Count
                    currentCount={0}
                    targetCount={100}
                />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actions={rescueActionsWithType}
                        onIncrement={() => () => {}}
                    />
                    <EnduranceView.SabotageActionsField
                        actions={sabotageActionsWithType}
                        onIncrement={() => () => {}}
                    />
                </EnduranceView.ActionsField>
            </EnduranceView>
        </CreateProjectLayout>
    );
};

export default CreateEnduranceProjectLayout;
