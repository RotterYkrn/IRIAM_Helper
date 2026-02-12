import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { duplicateProject } from "@/use-cases/projects/duplicateProject";

export const useDuplicateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: ProjectId) => {
            try {
                const result = await Effect.runPromise(
                    duplicateProject(projectId),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
