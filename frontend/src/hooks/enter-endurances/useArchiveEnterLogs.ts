import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ArchiveEnterLogsArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import { runEffectWithThrow } from "@/lib/utils";
import { archiveEnterLogs } from "@/use-cases/enter-endurances/archiveEnterLogs";

export const useArchiveEnterLogs = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: ArchiveEnterLogsArgs) =>
            await runEffectWithThrow(archiveEnterLogs(args)),
        onSuccess: (unitId) => {
            queryClient.invalidateQueries({
                queryKey: EnterEnduranceKey.unit(unitId),
            });
        },
    });

    return {
        archiveEnterLogs: mutation.mutate,
        isArchivingEnterLogs: mutation.isPending,
        archiveEnterLogsError: mutation.error,
    };
};
