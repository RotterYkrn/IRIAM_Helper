import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { updateEnduranceProject } from "@/use-cases/endurances/updateEnduranceProject";

export const useUpdateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UpdateEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    updateEnduranceProject(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({
                queryKey: ["project", projectId],
            });
        },
    });
};
