import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { LogEnduranceActionHistoryArgsEncoded } from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import { logEnduranceActionHistory } from "@/use-cases/endurances/logEnduranceActionHistory";

export const useLogEnduranceActionHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: LogEnduranceActionHistoryArgsEncoded) => {
            try {
                const result = await Effect.runPromise(
                    logEnduranceActionHistory(args),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({
                queryKey: ["actionStats", projectId],
            });
        },
    });
};
