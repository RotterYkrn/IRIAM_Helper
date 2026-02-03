import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { ActivateProjectArgsEncoded } from "@/domain/projects/rpcs/ActivateProject";
import { activateProject } from "@/use-cases/projects/activateProject";

export const useActivateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: ActivateProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(activateProject(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
