import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "@/use-cases/deleteProject";

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
