import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ArchiveEnterUnitArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import { archiveEnterUnit } from "@/use-cases/enter-endurances/archiveEnterUnit";

export const useArchiveEnterUnit = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: ArchiveEnterUnitArgs) => {
            try {
                const result = await Effect.runPromise(archiveEnterUnit(args));
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

    return {
        archive: mutation.mutate,
        isArchiving: mutation.isPending,
        archiveError: mutation.error,
    };
};
