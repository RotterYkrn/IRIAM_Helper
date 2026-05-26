import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ArchiveEnterUnitArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { archiveEnterUnit } from "@/use-cases/enter-endurances/archiveEnterUnit";

export const useArchiveEnterUnit = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: ArchiveEnterUnitArgs) =>
            await runEffectWithThrow(archiveEnterUnit(args)),
        onSuccess: (unitId) => {
            queryClient.invalidateQueries({
                queryKey: EnterEnduranceKey.unit(unitId),
            });
        },
    });

    return {
        archive: mutation.mutate,
        isArchiving: mutation.isPending,
        archiveError: mutation.error,
    };
};
