import { Chunk } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectContainer from "../projects/containers/CreateProjectContainer";
import EnduranceView from "../ui/EnduranceView";

import EditEnduranceActionRow from "./EditEnduranceActionRow";

import {
    editSabotageActionsAtomsNew,
    editRescueActionsAtomsNew,
} from "@/atoms/endurances-new/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances-new/EditEnduranceAtom";
import { editTargetCountAtom } from "@/atoms/endurances-new/EditTargetCountAtom";
import { EnduranceTargetCountSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import { ProjectTitleSchema } from "@/domain/projects/tables/Project";
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

    const [editTargetCountState, setEditTargetCount] =
        useAtom(editTargetCountAtom);
    const editRescueState = useAtomValue(editRescueActionsAtomsNew.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtomsNew.editActions,
    );

    const createMutation = useCreateEnduranceProjectNew();

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: ProjectTitleSchema.make("○○耐久"),
            target_count: EnduranceTargetCountSchema.make(100),
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
        <CreateProjectContainer
            isSaveDisabled={disabled}
            onSave={onSave}
        >
            <EnduranceView
                projectStatus={"scheduled"}
                isEdit={true}
                actionButtonCounts={Chunk.empty()}
            >
                <EnduranceView.EditTargetCount
                    targetCountState={editTargetCountState}
                    setTargetCount={setEditTargetCount}
                />
                <EnduranceView.ActionsField>
                    <EnduranceView.RescueActionsField
                        actionLength={0}
                        rescueCount={0}
                        isWide={false}
                    >
                        {Chunk.map(editRescueState, (action) => (
                            <EditEnduranceActionRow
                                key={action.id}
                                actionId={action.id}
                                actionType={"rescue"}
                            />
                        ))}
                    </EnduranceView.RescueActionsField>
                    <EnduranceView.SabotageActionsField
                        actionLength={0}
                        sabotageCount={0}
                        isWide={false}
                    >
                        {Chunk.map(editSabotageState, (action) => (
                            <EditEnduranceActionRow
                                key={action.id}
                                actionId={action.id}
                                actionType={"sabotage"}
                            />
                        ))}
                    </EnduranceView.SabotageActionsField>
                </EnduranceView.ActionsField>
            </EnduranceView>
        </CreateProjectContainer>
    );
};

export default CreateEnduranceProjectLayout;
