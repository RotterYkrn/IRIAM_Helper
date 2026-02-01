import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incrementEnduranceCount } from "@/use-cases/incrementEnduranceCount";

export const useIncrementEnduranceCount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: incrementEnduranceCount,

        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
    });
};
