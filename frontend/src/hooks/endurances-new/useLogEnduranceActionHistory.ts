import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import type { LogEnduranceActionHistoryNewArgsEncoded } from "@/domain/endurances-new/rpcs/LogEnduranceActionHistoryNew";
import { logEnduranceActionHistoryNew } from "@/use-cases/endurances-new/logEnduranceActionHistory";

export const useLogEnduranceActionHistoryNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: LogEnduranceActionHistoryNewArgsEncoded) => {
            try {
                const result = await Effect.runPromise(
                    logEnduranceActionHistoryNew(args),
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
