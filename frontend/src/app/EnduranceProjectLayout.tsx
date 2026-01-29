import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

import Endurance from "./Endurance";
import ProjectLayout from "./ProjectLayout";

import { editEnduranceAtom } from "@/atoms/EditEnduranceAtom";
import { editEnduranceSettingsAtom } from "@/atoms/EditEnduranceSettingsAtom";
import { editProjectAtom } from "@/atoms/EditProjectAtom";
import { enduranceProjectAtom } from "@/atoms/enduranceProjectAtom";
import { useUpdateEnduranceProject } from "@/hooks/useUpdateEnduranceProject";
import { supabase } from "@/lib/supabase";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const projectQuery = useAtomValue(enduranceProjectAtom);

    const queryClient = useQueryClient();
    const updateEnduranceProject = useUpdateEnduranceProject();

    const editState = useAtomValue(editEnduranceAtom);
    const initEditProject = useSetAtom(editProjectAtom);
    const initEditEnduranceSettings = useSetAtom(editEnduranceSettingsAtom);

    if (!projectQuery.data) {
        return null;
    }

    const project = projectQuery.data;

    const onIncrement = async () => {
        try {
            await supabase.rpc("increment_endurance_count", {
                p_project_id: projectId,
                p_increment: 1,
            });

            queryClient.invalidateQueries({
                queryKey: ["enduranceProgress", projectId],
            });
        } catch (e: any) {
            alert(e.message ?? "カウントできません");
        }
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
                projectId: project.id,
                title: editState.title,
                targetCount: editState.targetCount,
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
            <Endurance
                currentCount={project.current_count}
                targetCount={project.target_count}
                isActive={isActive}
                isEdit={isEdit}
                onIncrement={onIncrement}
            >
                {isEdit ? (
                    <Endurance.Editor />
                ) : (
                    <>
                        <Endurance.Count />
                        <Endurance.IncrementButton />
                    </>
                )}
            </Endurance>
        </ProjectLayout>
    );
};

export default EnduranceProjectLayout;
