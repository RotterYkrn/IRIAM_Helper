import { Chunk } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectContainer from "../projects/containers/CreateProjectContainer";
import EnduranceView from "../ui/EnduranceView";

import EditEnduranceActionRow from "./EditEnduranceActionRow";

import {
    editSabotageActionsAtoms,
    editRescueActionsAtoms,
} from "@/atoms/endurances/EditActionAtom";
import {
    initEditEnduranceAtom,
    isValidEditEnduranceAtom,
    validEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { editTargetCountAtom } from "@/atoms/endurances/EditTargetCountAtom";
import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceUnits";
import { ProjectTitleSchema } from "@/domain/projects/tables/Project";
import { useCreateEnduranceProject } from "@/hooks/endurances/useCreateEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

/**
 * 耐久企画新規作成ページのレイアウト
 */
const CreateEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const validEditState = useAtomValue(validEditEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const isValidEditState = useAtomValue(isValidEditEnduranceAtom);

    const [editTargetCountState, setEditTargetCount] =
        useAtom(editTargetCountAtom);
    const editRescueState = useAtomValue(editRescueActionsAtoms.editActions);
    const editSabotageState = useAtomValue(
        editSabotageActionsAtoms.editActions,
    );

    const { create, isCreating } = useCreateEnduranceProject();

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

        create(validEditState, {
            onSuccess: ({ id, title }) => {
                successToast(`「${title}」を作成しました`);
                navigate(`/projects/endurance/${id}`);
            },
            onError: (error, { title }) => {
                console.error(error);
                errorToast(`「${title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <CreateProjectContainer
            canSave={isValidEditState}
            isSaving={isCreating}
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
