import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import EnduranceProjectLayout from "../EnduranceProjectLayout";

import { useActivateProject } from "@/hooks/useActivateProject";
import { useEnduranceData } from "@/hooks/useEnduranceProject";
import { useFinishProject } from "@/hooks/useFinishProject";
import { supabase } from "@/lib/supabase";

const ProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    const queryClient = useQueryClient();

    const [projectQuery, settingsQuery, progressQuery] =
        useEnduranceData(projectId);
    const activateMutation = useActivateProject(projectId!);
    const finishMutation = useFinishProject(projectId!);

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
            {/* active 以外のときだけ表示 */}
            {projectStatus === "scheduled" && (
                <button
                    onClick={() => activateMutation.mutate()}
                    disabled={activateMutation.isPending}
                    className="rounded bg-green-600 px-6 py-2 text-white
                        hover:bg-green-700 disabled:opacity-50"
                >
                    配信開始
                </button>
            )}

            {/* 終了ボタン */}
            {projectStatus === "active" && (
                <button
                    onClick={() => finishMutation.mutate()}
                    disabled={finishMutation.isPending}
                    className="rounded bg-red-600 px-6 py-2 text-white
                        hover:bg-red-700"
                >
                    配信終了
                </button>
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
