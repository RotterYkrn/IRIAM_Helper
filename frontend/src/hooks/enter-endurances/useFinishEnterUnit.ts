import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { FinishEnterUnitArgs } from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { finishEnterUnit } from "@/use-cases/enter-endurances/finishEnterUnit";

export const useFinishEnterUnit = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (args: FinishEnterUnitArgs) =>
            await runEffectWithThrow(finishEnterUnit(args)),
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
