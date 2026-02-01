import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import EnduranceView from "./EnduranceView";
import ProjectLayout from "./ProjectLayout";

import { editEnduranceAtom } from "@/atoms/EditEnduranceAtom";
import { editEnduranceSettingsAtom } from "@/atoms/EditEnduranceSettingsAtom";
import { editProjectAtom } from "@/atoms/EditProjectAtom";
import { useFetchEnduranceData as useFetchEnduranceProject } from "@/hooks/useFetchEnduranceProject";
import { useIncrementEnduranceCount } from "@/hooks/useIncrementEnduranceCount";
import { useUpdateEnduranceProject } from "@/hooks/useUpdateEnduranceProject";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const projectQuery = useFetchEnduranceProject(projectId);
    const updateEnduranceProject = useUpdateEnduranceProject();
    const incrementEnduranceCount = useIncrementEnduranceCount();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditProject = useSetAtom(editProjectAtom);
    const initEditEnduranceSettings = useSetAtom(editEnduranceSettingsAtom);

    if (!projectQuery.data) {
        return null;
    }

    const project = projectQuery.data;

    const onIncrement = () => {
        incrementEnduranceCount.mutate({
            p_project_id: project.id,
            p_increment: 1,
        });
    };

    const isActive = projectQuery.data.status === "active";

    const onEdit = () => {
        initEditProject(project);
        initEditEnduranceSettings({
            targetCount: project.target_count,
        });
        setIsEdit(true);
    };

    const onSave = () => {
        updateEnduranceProject.mutate(
            {
                p_project_id: project.id,
                p_title: editState.title,
                p_target_count: editState.targetCount,
            },
            {
                onSuccess: () => {
                    setIsEdit(false);
                },
            },
        );
    };

    return (
        <ProjectLayout
            project={project}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            onEdit={onEdit}
            onSave={onSave}
        >
            <EnduranceView
                currentCount={project.current_count}
                targetCount={project.target_count}
                isActive={isActive}
                isEdit={isEdit}
                onIncrement={onIncrement}
            >
                {isEdit ? (
                    <EnduranceView.Editor />
                ) : (
                    <>
                        <EnduranceView.Count />
                        <EnduranceView.IncrementButton />
                    </>
                )}
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
