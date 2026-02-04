import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import EnduranceView from "./EnduranceView";
import ProjectLayout from "./ProjectLayout";

import {
    editEnduranceAtom,
    initEditEnduranceAtom,
} from "@/atoms/endurances/EditEnduranceAtom";
import { useFetchEnduranceData as useFetchEnduranceProject } from "@/hooks/endurances/useFetchEnduranceProject";
import { useIncrementEnduranceCount } from "@/hooks/endurances/useIncrementEnduranceCount";
import { useUpdateEnduranceProject } from "@/hooks/endurances/useUpdateEnduranceProject";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const projectQuery = useFetchEnduranceProject(projectId);
    const updateEnduranceProject = useUpdateEnduranceProject();
    const incrementEnduranceCount = useIncrementEnduranceCount();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditEnduranceAtom);

    if (!projectQuery.data) {
        return null;
    }

    const project = projectQuery.data;

    const onEdit = () => {
        initEditEndurance({
            title: project.title,
            target_count: project.target_count,
        });
        setIsEdit(true);
    };

    const onSave = () => {
        updateEnduranceProject.mutate(
            {
                p_project_id: project.id,
                p_title: editState.title,
                p_target_count: editState.target_count,
            },
            {
                onSuccess: () => {
                    setIsEdit(false);
                },
            },
        );
    };

    const onIncrement = () => {
        incrementEnduranceCount.mutate({
            p_project_id: project.id,
            p_increment: 1,
        });
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
                projectStatus={project.status}
                isEdit={isEdit}
            >
                <EnduranceView.Count
                    currentCount={project.current_count}
                    targetCount={project.target_count}
                />
                <EnduranceView.IncrementButton onIncrement={onIncrement} />
            </EnduranceView>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
