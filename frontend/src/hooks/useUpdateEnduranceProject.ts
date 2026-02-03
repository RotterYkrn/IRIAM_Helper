import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { UpdateEnduranceProjectArgsEncoded } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import type { EnduranceProjectView } from "@/domain/endurances/views/EnduranceProjectView";
import { updateEnduranceProject } from "@/use-cases/updateEnduranceProject";

export const useUpdateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UpdateEnduranceProjectArgsEncoded) => {
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
        onSuccess: ({ id, title, target_count }) => {
            queryClient.setQueryData<EnduranceProjectView>(
                ["project", id],
                (oldData) => {
                    return (
                        oldData && {
                            ...oldData,
                            title,
                            target_count,
                        }
                    );
                },
            );
        },
    });
};
