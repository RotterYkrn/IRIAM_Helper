import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectLayout from "../CreateProjectLayout";
import EnduranceView from "../EnduranceView";

import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { isEnduranceValidAtom } from "@/atoms/endurances/isEditEnduranceValidAtom";
import type { EnduranceSettingsSchema } from "@/domain/endurances/tables/EnduranceSettings";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { useCreateEnduranceProject } from "@/hooks/endurances/useCreateEnduranceProject";

const CreateEndurancePage = () => {
    const navigate = useNavigate();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);
    const disabled = !useAtomValue(isEnduranceValidAtom);

    const createMutation = useCreateEnduranceProject();

    useEffect(() => {
        initEditEndurance({
            title: "○○耐久" as typeof ProjectSchema.Type.title,
            target_count:
                100 as typeof EnduranceSettingsSchema.Type.target_count,
        });
    }, [initEditEndurance]);

    const onSave = async () => {
        createMutation.mutate(
            {
                p_title: editState.title,
                p_target_count: editState.target_count,
            },
            {
                onSuccess: (projectId) => {
                    navigate(`/projects/endurance/${projectId}`);
                },
                onError: (error) => {
                    console.error(error);
                    alert("作成に失敗しました。");
                },
            },
        );
    };

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
            </EnduranceView>
        </CreateProjectLayout>
    );
};

export default CreateEndurancePage;
