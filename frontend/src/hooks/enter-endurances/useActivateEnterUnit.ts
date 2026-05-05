import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { activateEnterUnit } from "@/use-cases/enter-endurances/activateEnterUnit";

export const useActivateEnterUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (unitId: typeof EnterUnitSchema.Type.id) => {
            try {
                const result = await Effect.runPromise(
                    activateEnterUnit({ id: unitId, started_at: new Date() }),
                );
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
