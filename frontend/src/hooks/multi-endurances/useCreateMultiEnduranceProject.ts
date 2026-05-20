import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { updateMultiEnduranceProjectQueryData } from "./utils";

import type { CreateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import { createMultiEnduranceProject } from "@/use-cases/multi-endurances/createMultiEnduranceProject";

export const useCreateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
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
        onSuccess: (createdProject) => {
            updateMultiEnduranceProjectQueryData(queryClient, createdProject);
        },
    });

    return {
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
