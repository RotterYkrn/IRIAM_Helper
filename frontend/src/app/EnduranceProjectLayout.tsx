import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";

import Endurance from "./Endurance";
import ProjectLayout from "./ProjectLayout";

import { editEnduranceAtom } from "@/atoms/EditEnduranceAtom";
import { useEnduranceData } from "@/hooks/useEnduranceProject";
import { supabase } from "@/lib/supabase";

type Props = {
    projectId: string;
};

const EnduranceProjectLayout = ({ projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const [projectQuery, settingsQuery, progressQuery] =
        useEnduranceData(projectId);

    const queryClient = useQueryClient();

    const editState = useAtomValue(editEnduranceAtom);

    if (!projectQuery.data || !settingsQuery.data || !progressQuery.data) {
        return null;
    }

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

    const onSave = async () => {
        await supabase.rpc("update_endurance_project", {
            p_project_id: projectId,
            p_title: editState.title,
            p_target_count: editState.targetCount,
        });
    };

    return (
        <ProjectLayout
            project={projectQuery.data}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            onSave={onSave}
        >
            <Endurance
                currentCount={progressQuery.data.current_count}
                targetCount={settingsQuery.data.target_count}
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
