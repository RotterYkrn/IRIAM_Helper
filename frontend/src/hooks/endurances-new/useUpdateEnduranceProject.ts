import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { UpdateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/UpdateEnduranceProjectNew";
import { updateEnduranceProjectNew } from "@/use-cases/endurances-new/updateEnduranceProject";

export const useUpdateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UpdateEnduranceProjectNewArgs) => {
            try {
                const result = await Effect.runPromise(
                    updateEnduranceProjectNew(args),
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
            queryClient.invalidateQueries({
                queryKey: ["actionStat", projectId],
            });
        },
    });
};
