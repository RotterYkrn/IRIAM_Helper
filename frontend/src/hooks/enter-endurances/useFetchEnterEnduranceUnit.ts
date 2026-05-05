import { useSuspenseQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { fetchEnterEnduranceUnit } from "@/use-cases/enter-endurances/fetchEnterEnduranceUnit";

export const useFetchEnterEnduranceUnit = (
    unitId: typeof EnterUnitSchema.Type.id,
) => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.unit(unitId),
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    fetchEnterEnduranceUnit(unitId),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });
};
