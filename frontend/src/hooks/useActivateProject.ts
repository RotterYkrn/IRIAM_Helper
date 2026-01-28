import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export const useActivateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: string) => {
            const { error } = await supabase.rpc("activate_project", {
                p_project_id: projectId,
            });

            if (error) throw error;

            return projectId;
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // sidebar
        },
    });
};
