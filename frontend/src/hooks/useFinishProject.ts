import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { FinishProjectArgsEncoded } from "@/domain/projects/rpcs/FinishProject";
import { finishProject } from "@/use-cases/finishProject";

export const useFinishProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: FinishProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(finishProject(args));
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
