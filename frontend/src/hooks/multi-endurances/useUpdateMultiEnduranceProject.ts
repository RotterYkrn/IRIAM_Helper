import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { updateMultiEnduranceProjectQueryData } from "./utils";

import type { UpdateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { updateMultiEnduranceProject } from "@/use-cases/multi-endurances/updateMultiEnduranceProject";

export const useUpdateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: UpdateMultiEnduranceProjectArgs) => {
            try {
                const result = await Effect.runPromise(
                    updateMultiEnduranceProject(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (updatedProject) => {
            updateMultiEnduranceProjectQueryData(queryClient, updatedProject);
        },
    });

    return {
        update: mutation.mutate,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};
