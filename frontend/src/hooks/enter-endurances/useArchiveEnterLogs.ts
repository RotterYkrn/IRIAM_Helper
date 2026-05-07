import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ArchiveEnterLogsArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import { archiveEnterLogs } from "@/use-cases/enter-endurances/archiveEnterLogs";

export const useArchiveEnterLogs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: ArchiveEnterLogsArgs) => {
            try {
                const result = await Effect.runPromise(archiveEnterLogs(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: (unitId) => {
            queryClient.invalidateQueries({
                queryKey: EnterEnduranceKey.unit(unitId),
            });
        },
    });
};
