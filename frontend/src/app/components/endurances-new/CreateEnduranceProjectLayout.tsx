import { Chunk, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

import EditEnduranceActionRow from "./EditEnduranceActionRow";
import EnduranceView from "./EnduranceView";

import {
    editSabotageActionsAtomsNew,
    editRescueActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import {
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "@/domain/endurances-new/tables/EnduranceActionCounts";
import { EnduranceActionTypeSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { EnduranceTargetCountSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import {
    ProjectStatusSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";
import { useCreateEnduranceProjectNew } from "@/hooks/endurances-new/useCreateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

/**
 * 耐久企画新規作成ページのレイアウト
 */
const CreateEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const validEditState = useAtomValue(validEditEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isValidEditEnduranceAtom);

    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    const createMutation = useCreateEnduranceProjectNew();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: Schema.decodeSync(ProjectTitleSchema)("○○耐久"),
            target_count: Schema.decodeSync(EnduranceTargetCountSchema)(100),
            rescue_actions: Chunk.empty(),
            sabotage_actions: Chunk.empty(),
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
        <CreateProjectLayout
            isSaveDisabled={disabled}
            onSave={onSave}
        >
            <EnduranceView
                projectStatus={Schema.decodeSync(ProjectStatusSchema)(
                    "scheduled",
                )}
                isEdit={true}
                actionButtonCounts={Chunk.empty()}
            >
                <EnduranceView.EditTargetCount />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={0}
                        rescueCount={Schema.decodeSync(
                            EnduranceRescueCountSchema,
                        )(0)}
                        isWide={false}
                    >
                        {Chunk.map(editRescueState, (action) => (
                            <EditEnduranceActionRow
                                key={action.id}
                                actionId={action.id}
                                actionType={Schema.decodeSync(
                                    EnduranceActionTypeSchema,
                                )("rescue")}
                            />
                        ))}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={0}
                        sabotageCount={Schema.decodeSync(
                            EnduranceSabotageCountSchema,
                        )(0)}
                        isWide={false}
                    >
                        {Chunk.map(editSabotageState, (action) => (
                            <EditEnduranceActionRow
                                key={action.id}
                                actionId={action.id}
                                actionType={Schema.decodeSync(
                                    EnduranceActionTypeSchema,
                                )("sabotage")}
                            />
                        ))}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </CreateProjectLayout>
    );
};

export default CreateEnduranceProjectLayout;
