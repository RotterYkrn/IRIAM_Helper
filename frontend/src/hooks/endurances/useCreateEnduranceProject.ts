import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { CreateEnduranceProjectArgs } from "@/domain/endurances/rpcs/CreateEnduranceProject";
import { createEnduranceProject } from "@/use-cases/endurances/createEnduranceProject";

export const useCreateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: CreateEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    createEnduranceProject(args),
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
