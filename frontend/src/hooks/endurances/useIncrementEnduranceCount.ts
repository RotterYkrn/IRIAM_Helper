import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { IncrementEnduranceCountArgsEncoded } from "@/domain/endurances/rpcs/IncrementEnduranceCount";
import { incrementEnduranceCount } from "@/use-cases/endurances/incrementEnduranceCount";

export const useIncrementEnduranceCount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: IncrementEnduranceCountArgsEncoded) => {
            try {
                const result = await Effect.runPromise(
                    incrementEnduranceCount(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
    });
};
