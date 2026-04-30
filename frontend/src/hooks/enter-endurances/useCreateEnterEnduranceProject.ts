import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { createEnterEnduranceProject } from "@/use-cases/enter-endurances/createEnterEnduranceProject";

export const useCreateEnterEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                const result = await Effect.runPromise(
                    createEnterEnduranceProject(),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.setQueryData(EnterEnduranceKey.projectId, projectId);
        },
    });
};
