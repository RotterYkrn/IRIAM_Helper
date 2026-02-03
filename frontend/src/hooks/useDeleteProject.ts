import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { DeleteProjectArgsEncoded } from "@/domain/projects/rpcs/DeleteProject";
import { deleteProject } from "@/use-cases/deleteProject";

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: DeleteProjectArgsEncoded) => {
            try {
                const result = await Effect.runPromise(deleteProject(args));
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
