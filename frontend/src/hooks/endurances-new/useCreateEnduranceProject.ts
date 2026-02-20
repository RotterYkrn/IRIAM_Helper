import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { CreateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/CreateEnduranceProjectNew";
import { createEnduranceProjectNew } from "@/use-cases/endurances-new/createEnduranceProject";

export const useCreateEnduranceProjectNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: CreateEnduranceProjectNewArgs) => {
            try {
                const result = await Effect.runPromise(
                    createEnduranceProjectNew(args),
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
