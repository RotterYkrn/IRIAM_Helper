import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export type EnduranceProject = {
    id: string;
    title: string;
    status: "scheduled" | "active" | "finished";
    target_count: number;
    current_count: number;
};

type ProjectUpdate = {
    projectId: string;
    title: string;
    targetCount: number;
};

export const useUpdateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            projectId,
            title,
            targetCount,
        }: ProjectUpdate) => {
            await supabase.rpc("update_endurance_project", {
                p_project_id: projectId,
                p_title: title,
                p_target_count: targetCount,
            });

            return {
                projectId,
                title,
                targetCount,
            };
        },
        onSuccess: ({ projectId, title, targetCount }) => {
            queryClient.setQueryData<EnduranceProject>(
                ["enduranceProject", projectId],
                (oldData) => {
                    return (
                        oldData && {
                            ...oldData,
                            title,
                            target_count: targetCount,
                        }
                    );
                },
            );
        },
    });
};
