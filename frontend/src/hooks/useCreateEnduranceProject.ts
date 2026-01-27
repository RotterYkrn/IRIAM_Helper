import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createEnduranceProject } from "@/use-cases/createEnduranceProject";

export const useCreateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEnduranceProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
