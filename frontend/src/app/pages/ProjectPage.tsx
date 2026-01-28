import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import EnduranceProjectLayout from "../EnduranceProjectLayout";

import ActivateProjectButton from "@/components/projects/ActivateProjectButton";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import FinishProjectButton from "@/components/projects/FinishProjectButton";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useEnduranceData } from "@/hooks/useEnduranceProject";
import { supabase } from "@/lib/supabase";

const ProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [projectQuery, settingsQuery, progressQuery] =
        useEnduranceData(projectId);
    const deleteMutation = useDeleteProject();

    if (!projectId) {
        return <div>Project ID is required.</div>;
    }

    if (
        projectQuery.isLoading ||
        settingsQuery.isLoading ||
        progressQuery.isLoading
    ) {
        return <div>loading...</div>;
    }

    if (!projectQuery.data || !settingsQuery.data || !progressQuery.data) {
        return <div>not found</div>;
    }

    const handleIncrement = async () => {
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

    const projectStatus = projectQuery.data.status;

    return (
        <>
            {projectStatus === "scheduled" && (
                <DeleteProjectButton projectId={projectId} />
            )}
            {projectStatus === "scheduled" && (
                <ActivateProjectButton projectId={projectId} />
            )}
            {projectStatus === "active" && (
                <FinishProjectButton projectId={projectId} />
            )}

            <EnduranceProjectLayout
                title={projectQuery.data.title}
                currentCount={progressQuery.data.current_count}
                targetCount={settingsQuery.data.target_count}
                isActive={projectStatus === "active"}
                onIncrement={handleIncrement}
            />
        </>
    );
};

export default ProjectPage;
