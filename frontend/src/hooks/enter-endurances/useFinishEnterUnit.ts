import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { FinishEnterUnitArgs } from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import { finishEnterUnit } from "@/use-cases/enter-endurances/finishEnterUnit";

export const useFinishEnterUnit = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: FinishEnterUnitArgs) => {
            try {
                const result = await Effect.runPromise(finishEnterUnit(args));
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
        finish: mutation.mutate,
        isFinishing: mutation.isPending,
        finishError: mutation.error,
    };
};
