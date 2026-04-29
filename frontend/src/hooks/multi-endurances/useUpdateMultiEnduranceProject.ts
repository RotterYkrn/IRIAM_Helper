import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { UpdateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { updateMultiEnduranceProject } from "@/use-cases/multi-endurances/updateMultiEnduranceProject";

export const useUpdateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
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
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({
                queryKey: ProjectKey.detail(projectId),
            });
        },
    });
};
