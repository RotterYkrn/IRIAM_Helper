import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { DuplicateEnduranceProjectArgs } from "@/domain/endurances-new/rpcs/DuplicateEnduranceProject";
import { duplicateEnduranceProject } from "@/use-cases/endurances-new/duplicateEnduranceProject";

export const useDuplicateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: DuplicateEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    duplicateEnduranceProject(args),
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
