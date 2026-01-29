import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo, useState } from "react";

import Endurance from "./Endurance";
import ProjectLayout from "./ProjectLayout";

import { editEnduranceAtom } from "@/atoms/EditEnduranceAtom";
import { editEnduranceSettingsAtom } from "@/atoms/EditEnduranceSettingsAtom";
import { editProjectAtom } from "@/atoms/EditProjectAtom";
import { enduranceProjectAtom } from "@/atoms/enduranceProjectAtom";
import { supabase } from "@/lib/supabase";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const atom = useMemo(() => enduranceProjectAtom(projectId), [projectId]);
    const projectQuery = useAtomValue(atom);

    const queryClient = useQueryClient();

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

    const onSave = async () => {
        await supabase.rpc("update_endurance_project", {
            p_project_id: projectId,
            p_title: editState.title,
            p_target_count: editState.targetCount,
        });

        setIsEdit(false);
    };

    console.log("再レンダリング実行！");

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
