import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { CreateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import { createMultiEnduranceProject } from "@/use-cases/multi-endurances/createMultiEnduranceProject";

export const useCreateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: CreateMultiEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    createMultiEnduranceProject(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ProjectKey.list });
        },
    });
};
