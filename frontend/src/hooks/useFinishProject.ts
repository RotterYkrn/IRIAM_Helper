import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishProject } from "@/use-cases/finishProject";

export const useFinishProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: finishProject,
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // sidebar
        },
    });
};
