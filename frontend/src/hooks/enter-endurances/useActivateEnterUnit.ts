import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { activateEnterUnit } from "@/use-cases/enter-endurances/activateEnterUnit";

export const useActivateEnterUnit = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (unitId: typeof EnterUnitSchema.Type.id) =>
            await runEffectWithThrow(
                activateEnterUnit({
                    unit_id: unitId,
                    started_at: new Date(Date.now()),
                }),
            ),
        onSuccess: (unitId) => {
            queryClient.invalidateQueries({
                queryKey: EnterEnduranceKey.unit(unitId),
            });
        },
    });

    return {
        activateUnit: mutation.mutate,
        isActivatingUnit: mutation.isPending,
        activateUnitError: mutation.error,
    };
};
