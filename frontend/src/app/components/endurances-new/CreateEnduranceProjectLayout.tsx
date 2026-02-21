import { Chunk, Schema } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../projects/CreateProjectLayout";

import EnduranceView from "./EnduranceView";

import {
    editSabotageActionsAtomsNew,
    editRescueActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
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

const CreateEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const editState = useAtomValue(editEnduranceAtomNew);
    const initEditEndurance = useSetAtom(initEditEnduranceAtomNew);
    const disabled = !useAtomValue(isEnduranceValidAtomNew);

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
                            <EnduranceView.Action key={action.id}>
                                <EnduranceView.EditSettingsLayout>
                                    <EnduranceView.EditLabel
                                        editLabelAtom={editRescueActionsAtomsNew.editLabel(
                                            action.id,
                                        )}
                                    />
                                    <EnduranceView.EditAmount
                                        editAmountAtom={editRescueActionsAtomsNew.editAmount(
                                            action.id,
                                        )}
                                    />
                                </EnduranceView.EditSettingsLayout>
                                <EnduranceView.DeleteActionButton
                                    deleteActionAtom={editRescueActionsAtomsNew.deleteAction(
                                        action.id,
                                    )}
                                />
                            </EnduranceView.Action>
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
                            <EnduranceView.Action key={action.id}>
                                <EnduranceView.EditSettingsLayout>
                                    <EnduranceView.EditLabel
                                        editLabelAtom={editSabotageActionsAtomsNew.editLabel(
                                            action.id,
                                        )}
                                    />
                                    <EnduranceView.EditAmount
                                        editAmountAtom={editSabotageActionsAtomsNew.editAmount(
                                            action.id,
                                        )}
                                    />
                                </EnduranceView.EditSettingsLayout>
                                <EnduranceView.DeleteActionButton
                                    deleteActionAtom={editSabotageActionsAtomsNew.deleteAction(
                                        action.id,
                                    )}
                                />
                            </EnduranceView.Action>
                        ))}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </CreateProjectLayout>
    );
};

export default CreateEnduranceProjectLayout;
